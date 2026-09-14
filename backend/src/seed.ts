import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './users/schemas/user.schema';
import { Unit } from './units/schemas/unit.schema';
import * as bcrypt from 'bcryptjs';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const userModel = app.get<Model<User>>(getModelToken(User.name));
  const unitModel = app.get<Model<Unit>>(getModelToken(Unit.name));

  console.log('Clearing database...');
  await userModel.deleteMany({});
  await unitModel.deleteMany({});

  console.log('Seeding Admins...');
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('admin123', salt);

  await userModel.create([
    {
      email: 'director@cruzeiro.com',
      passwordHash,
      name: 'Director',
      role: 'Director',
    },
    {
      email: 'secretary@cruzeiro.com',
      passwordHash,
      name: 'Secretary',
      role: 'Secretary',
    },
  ]);

  console.log('Seeding Units...');
  const boysUnits = [
    {
      name: 'Centaurus',
      category: 'Masculino',
      color: '#EF4444',
      class: 'Amigo',
      logoUrl: '/placeholder.png',
    }, // Red-500
    {
      name: 'Pegasus',
      category: 'Masculino',
      color: '#F97316',
      class: 'Companheiro',
      logoUrl: '/placeholder.png',
    }, // Orange-500
    {
      name: 'Argus',
      category: 'Masculino',
      color: '#EAB308',
      class: 'Pesquisador',
      logoUrl: '/placeholder.png',
    }, // Yellow-500
    {
      name: 'Corvus',
      category: 'Masculino',
      color: '#22C55E',
      class: 'Pioneiro',
      logoUrl: '/placeholder.png',
    }, // Green-500
    {
      name: 'Taurus',
      category: 'Masculino',
      color: '#3B82F6',
      class: 'Excursionista',
      logoUrl: '/placeholder.png',
    }, // Blue-500
  ];

  const girlsUnits = [
    {
      name: 'Ursa Menor',
      category: 'Feminino',
      color: '#EC4899',
      class: 'Amigo',
      logoUrl: '/placeholder.png',
    }, // Pink-500
    {
      name: 'Andrômeda',
      category: 'Feminino',
      color: '#F43F5E',
      class: 'Companheiro',
      logoUrl: '/placeholder.png',
    }, // Rose-500
    {
      name: 'Aquarius',
      category: 'Feminino',
      color: '#D946EF',
      class: 'Pesquisador',
      logoUrl: '/placeholder.png',
    }, // Fuchsia-500
    {
      name: 'Orion',
      category: 'Feminino',
      color: '#A855F7',
      class: 'Pioneiro',
      logoUrl: '/placeholder.png',
    }, // Purple-500
    {
      name: 'Lira',
      category: 'Feminino',
      color: '#14B8A6',
      class: 'Excursionista',
      logoUrl: '/placeholder.png',
    }, // Teal-500
    {
      name: 'Ursa Maior',
      category: 'Feminino',
      color: '#06B6D4',
      class: 'Guia',
      logoUrl: '/placeholder.png',
    }, // Cyan-500
  ];

  await unitModel.create([...boysUnits, ...girlsUnits]);

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap();
