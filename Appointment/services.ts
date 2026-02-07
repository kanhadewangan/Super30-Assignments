import express from 'express';
import prisma from './prisma/prisma';
import {UserAuth,AdminAuth} from './auth';
import { date } from 'zod';
import { date } from 'zod';


const router = express.Router();


router.get("/services", UserAuth, async (req, res) => {
  try {
    const services = await prisma.services.findMany();
    res.json(services);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post('/services',AdminAuth, async (req, res) => {
  const { name, type, duarationMinutes } = req.body;
  try {
    const service = await prisma.services.create({
      data: {
        name,
        type,
        duarationMinutes,
        provierId : (req as any).user.userId,
      },
    });
    res.json(service);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post('/services/:serviceId/availability',AdminAuth, async (req, res) => {
    const { serviceId } = req.params;
    const {dayOfWeek,startTime,endTime} = req.body;

    try {
      const availability = await prisma.availability.create({
        data: {
            dayOfWeek,
            startTime,
            endTime,
            providerId : (req as any).user.userId,
            serviceId : parseInt(serviceId, 10),
        },
      });
      res.json(availability);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }   
})


router.get('/services',async (req, res) => {
    try {
        const querry = req.query.type as string | undefined;
      const services = await prisma.services.findMany({
        where:{
            type: querry,
        }
       
      });
      res.json(services);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }   
})












