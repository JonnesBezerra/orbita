"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const mongoose_1 = require("@nestjs/mongoose");
const user_schema_1 = require("./users/schemas/user.schema");
const unit_schema_1 = require("./units/schemas/unit.schema");
const bcrypt = require("bcryptjs");
async function bootstrap() {
    const app = await core_1.NestFactory.createApplicationContext(app_module_1.AppModule);
    const userModel = app.get((0, mongoose_1.getModelToken)(user_schema_1.User.name));
    const unitModel = app.get((0, mongoose_1.getModelToken)(unit_schema_1.Unit.name));
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
        },
        {
            name: 'Pegasus',
            category: 'Masculino',
            color: '#F97316',
            class: 'Companheiro',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Argus',
            category: 'Masculino',
            color: '#EAB308',
            class: 'Pesquisador',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Corvus',
            category: 'Masculino',
            color: '#22C55E',
            class: 'Pioneiro',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Taurus',
            category: 'Masculino',
            color: '#3B82F6',
            class: 'Excursionista',
            logoUrl: '/placeholder.png',
        },
    ];
    const girlsUnits = [
        {
            name: 'Ursa Menor',
            category: 'Feminino',
            color: '#EC4899',
            class: 'Amigo',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Andrômeda',
            category: 'Feminino',
            color: '#F43F5E',
            class: 'Companheiro',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Aquarius',
            category: 'Feminino',
            color: '#D946EF',
            class: 'Pesquisador',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Orion',
            category: 'Feminino',
            color: '#A855F7',
            class: 'Pioneiro',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Lira',
            category: 'Feminino',
            color: '#14B8A6',
            class: 'Excursionista',
            logoUrl: '/placeholder.png',
        },
        {
            name: 'Ursa Maior',
            category: 'Feminino',
            color: '#06B6D4',
            class: 'Guia',
            logoUrl: '/placeholder.png',
        },
    ];
    await unitModel.create([...boysUnits, ...girlsUnits]);
    console.log('Database seeded successfully!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map