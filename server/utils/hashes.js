import bcrypt from 'bcryptjs';

export const hashPassword = (data) => {
    return bcrypt.hash(data, 10);
}

export const comparePassword = (data1, data2) => {
    return bcrypt.compare(data1, data2);
}