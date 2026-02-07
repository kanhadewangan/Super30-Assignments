import express from 'express';
import { UserAuth } from "./auth";
import { AdminAuth } from "./auth";
import prisma from './prisma/prisma';
const router = express.Router();


router.post('/appointments', UserAuth, async (req, res) => {
    const { serviceId, appointmentTime } = req.body;
    try {
      const appointment = await prisma.appointments.create({
        data: {
          userId: (req as any).user.userId,
          serviceId,
          date: new Date(appointmentTime),
          status:"BOOKED",
          slotId: 1, // Assuming a fixed slot ID for simplicity
          startTime: new Date(appointmentTime).toString(),
          endTime: new Date(new Date(appointmentTime).getTime() + 30 * 60000).toString(), // Assuming 30 minutes duration
        },
      });
      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });


  router.post("/appointments/:appointmentId/cancel", UserAuth, async (req, res) => {
    const { appointmentId } = req.params;
    try {
      const appointment = await prisma.appointments.update({
        where: {
          id: parseInt(appointmentId, 10),
        },
        data: {
          status: "CANCELLED",
        },
      });
      res.json(appointment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });
router.get('/appointments', UserAuth, async (req, res) => {
    try {
      const appointments = await prisma.appointments.findMany({
        where: {
          userId: (req as any).user.userId,
        },
        include: {
          service: true,
        },
      });
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  });

export default router;