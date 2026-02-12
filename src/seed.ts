import * as mongoose from 'mongoose';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const DB =
  process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017/rezervachka';

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: 'admin' },
});

const DoctorSchema = new mongoose.Schema({
  name: String,
  specialization: String,
  languages: [String],
  schedule: Object,
  slotDurationMinutes: { type: Number, default: 30 },
  isActive: { type: Boolean, default: true },
});

const SlotSchema = new mongoose.Schema({
  doctorId: mongoose.Types.ObjectId,
  date: String,
  startTime: String,
  endTime: String,
  status: { type: String, default: 'available' },
});
SlotSchema.index({ doctorId: 1, date: 1, startTime: 1 }, { unique: true });

async function seed() {
  await mongoose.connect(DB);
  console.log('Connected to', DB);

  const User = mongoose.model('User', UserSchema);
  const Doctor = mongoose.model('Doctor', DoctorSchema);
  const Slot = mongoose.model('Slot', SlotSchema);

  // Create admin user
  const existing = await User.findOne({ email: 'admin@clinic.cz' });
  if (!existing) {
    const hash = await bcrypt.hash('123456', 10);
    await User.create({
      name: 'Admin',
      email: 'admin@clinic.cz',
      password: hash,
      role: 'admin',
    });
    console.log('Admin user created: admin@clinic.cz / 123456');
  } else {
    console.log('Admin user already exists');
  }

  // Create doctors
  const doctors = [
    {
      name: 'MUDr. Olga Petrova',
      specialization: 'Urolog',
      languages: ['CZ', 'RU', 'UA'],
      schedule: {
        mon: { from: '08:00', to: '16:00' },
        tue: { from: '08:00', to: '16:00' },
        wed: { from: '08:00', to: '12:00' },
        thu: { from: '08:00', to: '16:00' },
        fri: { from: '08:00', to: '14:00' },
      },
      slotDurationMinutes: 30,
    },
    {
      name: 'MUDr. Karel Dvorak',
      specialization: 'Urolog',
      languages: ['CZ', 'EN'],
      schedule: {
        mon: { from: '09:00', to: '17:00' },
        tue: { from: '09:00', to: '17:00' },
        wed: { from: '09:00', to: '17:00' },
        thu: { from: '09:00', to: '17:00' },
        fri: { from: '09:00', to: '13:00' },
      },
      slotDurationMinutes: 30,
    },
  ];

  const createdDoctors: any[] = [];
  for (const doc of doctors) {
    let existing = await Doctor.findOne({ name: doc.name });
    if (!existing) {
      existing = await Doctor.create(doc);
      console.log(`Doctor created: ${doc.name}`);
    } else {
      console.log(`Doctor already exists: ${doc.name}`);
    }
    createdDoctors.push(existing);
  }

  // Generate slots for current and next month
  const now = new Date();
  const months = [
    { year: now.getFullYear(), month: now.getMonth() + 1 },
    {
      year: now.getMonth() === 11 ? now.getFullYear() + 1 : now.getFullYear(),
      month: now.getMonth() === 11 ? 1 : now.getMonth() + 2,
    },
  ];

  const dayMap: Record<string, number> = {
    mon: 1, tue: 2, wed: 3, thu: 4, fri: 5,
  };

  for (const doctor of createdDoctors) {
    for (const { year, month } of months) {
      const daysInMonth = new Date(year, month, 0).getDate();
      let generated = 0;

      for (let day = 1; day <= daysInMonth; day++) {
        const dateObj = new Date(year, month - 1, day);
        const dayOfWeek = dateObj.getDay();

        for (const [dayName, dayNum] of Object.entries(dayMap)) {
          if (dayOfWeek !== dayNum) continue;
          const daySchedule = (doctor.schedule as any)?.[dayName];
          if (!daySchedule) continue;

          const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const [fromH, fromM] = daySchedule.from.split(':').map(Number);
          const [toH, toM] = daySchedule.to.split(':').map(Number);
          const startMin = fromH * 60 + fromM;
          const endMin = toH * 60 + toM;

          for (
            let m = startMin;
            m + doctor.slotDurationMinutes <= endMin;
            m += doctor.slotDurationMinutes
          ) {
            const startTime = `${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
            const endM = m + doctor.slotDurationMinutes;
            const endTime = `${String(Math.floor(endM / 60)).padStart(2, '0')}:${String(endM % 60).padStart(2, '0')}`;

            try {
              await Slot.updateOne(
                { doctorId: doctor._id, date: dateStr, startTime },
                {
                  $setOnInsert: {
                    doctorId: doctor._id,
                    date: dateStr,
                    startTime,
                    endTime,
                    status: 'available',
                  },
                },
                { upsert: true },
              );
              generated++;
            } catch {
              // skip duplicate
            }
          }
        }
      }
      console.log(
        `Generated ${generated} slots for ${doctor.name} - ${year}/${String(month).padStart(2, '0')}`,
      );
    }
  }

  console.log('\nSeed complete!');
  console.log('Login: admin@clinic.cz / 123456');
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error('Seed error:', err);
  process.exit(1);
});
