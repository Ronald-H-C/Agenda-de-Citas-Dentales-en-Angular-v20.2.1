const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const userRoutes = require('./routes/userRoutes'); // para login/registro básico
const adminUsersRoutes = require('./routes/admin/usersRoutes'); // para CRUD admin
const specialtiesRoutes = require('./routes/admin/specialtiesRoutes');
const dentistsRoutes = require('./routes/admin/dentistsRoutes');
const schedulesRoutes = require('./routes/admin/schedulesRoutes');
const officesRoutes = require('./routes/admin/officesRoutes');
const appointmentsRoutes = require('./routes/admin/appointmentsRoutes');
dotenv.config();
const app = express();

// Configuración CORS
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:4200')
  .split(',')
  .map(o => o.trim());

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
}));
app.use(morgan('dev'));
app.use(express.json());

// Rutas ADMIN

app.use('/api/users', userRoutes);          // login/registro
app.use('/api/admin/users', adminUsersRoutes); // CRUD protegido para admin de users
app.use('/api/admin/specialties', specialtiesRoutes); //CRUD protegido para admin de especialidades
app.use('/api/admin/dentists', dentistsRoutes); //CRUD protegido para admin de Detistas
app.use('/api/admin/schedules', schedulesRoutes); //CRUD protegido para admin de horarios
app.use('/api/admin/offices', officesRoutes);//CRUD protegido para admin de oficinas
app.use('/api/admin/appointments', appointmentsRoutes);//CRUD protegido para admin de citas

// Rutas DENTIST
const dentistAppointmentsRoutes = require('./routes/dentist/appointmentsRoutes');
app.use('/api/dentist/appointments', dentistAppointmentsRoutes);
// Dentista - Schedules
const dentistSchedulesRoutes = require('./routes/dentist/schedulesRoutes');
app.use('/api/dentist/schedules', dentistSchedulesRoutes);
// ✅ Rutas de paciente
const patientAppointmentsRoutes = require('./routes/patient/appointmentsRoutes');
app.use('/api/patient/appointments', patientAppointmentsRoutes);
// 📌 Rutas para citas de paciente (nueva cita)
const patientNewAppointmentsRoutes = require('./routes/patient/new-appointmentsRoutes');
app.use('/api/patient/new-appointments', patientNewAppointmentsRoutes);
// Rutas Patient
app.use('/api/patient/profile', require('./routes/patient/profileRoutes'));


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
