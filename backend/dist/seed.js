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
        }
    ]);
    console.log('Seeding Units...');
    const boysUnits = [
        { name: 'Leão', category: 'Boys', color: '#EF4444', logoUrl: '/placeholder.png' },
        { name: 'Tigre', category: 'Boys', color: '#F97316', logoUrl: '/placeholder.png' },
        { name: 'Águia', category: 'Boys', color: '#EAB308', logoUrl: '/placeholder.png' },
        { name: 'Falcão', category: 'Boys', color: '#22C55E', logoUrl: '/placeholder.png' },
        { name: 'Urso', category: 'Boys', color: '#3B82F6', logoUrl: '/placeholder.png' },
        { name: 'Lobo', category: 'Boys', color: '#6366F1', logoUrl: '/placeholder.png' },
    ];
    const girlsUnits = [
        { name: 'Orquídea', category: 'Girls', color: '#EC4899', logoUrl: '/placeholder.png' },
        { name: 'Rosa', category: 'Girls', color: '#F43F5E', logoUrl: '/placeholder.png' },
        { name: 'Lírio', category: 'Girls', color: '#D946EF', logoUrl: '/placeholder.png' },
        { name: 'Margarida', category: 'Girls', color: '#A855F7', logoUrl: '/placeholder.png' },
        { name: 'Girassol', category: 'Girls', color: '#14B8A6', logoUrl: '/placeholder.png' },
        { name: 'Violeta', category: 'Girls', color: '#06B6D4', logoUrl: '/placeholder.png' },
    ];
    await unitModel.create([...boysUnits, ...girlsUnits]);
    console.log('Database seeded successfully!');
    await app.close();
}
bootstrap();
//# sourceMappingURL=seed.js.map