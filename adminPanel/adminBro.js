
const AdminBro = require('admin-bro');
const AdminBroExpress = require('@admin-bro/express');
const AdminBroMongoose = require('@admin-bro/mongoose');
const User = require('../model/User');
const Topic = require('../model/topic');
const Question = require('../model/questions');
const Admin = require('../model/admin');
const Experience = require('../model/InterviewExperience');

AdminBro.registerAdapter(AdminBroMongoose);

const AdminBroOptions = {
    resources: [User,Topic,Question,Admin,Experience],
    rootPath: '/admin',
}


const adminBro = new AdminBro(AdminBroOptions);
const routerAdminBro = AdminBroExpress.buildRouter(adminBro);


module.exports = routerAdminBro