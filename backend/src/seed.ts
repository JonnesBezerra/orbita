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
    }
  ]);

  console.log('Seeding Units...');
  const boysUnits = [
    { name: 'Leão', category: 'Boys', color: '#EF4444', logoUrl: '/placeholder.png' }, // Red-500
    { name: 'Tigre', category: 'Boys', color: '#F97316', logoUrl: '/placeholder.png' }, // Orange-500
    { name: 'Águia', category: 'Boys', color: '#EAB308', logoUrl: '/placeholder.png' }, // Yellow-500
    { name: 'Falcão', category: 'Boys', color: '#22C55E', logoUrl: '/placeholder.png' }, // Green-500
    { name: 'Urso', category: 'Boys', color: '#3B82F6', logoUrl: '/placeholder.png' }, // Blue-500
    { name: 'Lobo', category: 'Boys', color: '#6366F1', logoUrl: '/placeholder.png' }, // Indigo-500
  ];

  const girlsUnits = [
    { name: 'Orquídea', category: 'Girls', color: '#EC4899', logoUrl: '/placeholder.png' }, // Pink-500
    { name: 'Rosa', category: 'Girls', color: '#F43F5E', logoUrl: '/placeholder.png' }, // Rose-500
    { name: 'Lírio', category: 'Girls', color: '#D946EF', logoUrl: '/placeholder.png' }, // Fuchsia-500
    { name: 'Margarida', category: 'Girls', color: '#A855F7', logoUrl: '/placeholder.png' }, // Purple-500
    { name: 'Girassol', category: 'Girls', color: '#14B8A6', logoUrl: '/placeholder.png' }, // Teal-500
    { name: 'Violeta', category: 'Girls', color: '#06B6D4', logoUrl: '/placeholder.png' }, // Cyan-500
  ];

  await unitModel.create([...boysUnits, ...girlsUnits]);

  console.log('Database seeded successfully!');
  await app.close();
}

bootstrap();

