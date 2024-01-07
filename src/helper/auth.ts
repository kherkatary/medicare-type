import bcrypt from 'bcrypt'
const hashingPassword = async (password: string) => {
    try {
        const saltRounds =10
        const hashedPass = await bcrypt.hash(password, saltRounds);
        return hashedPass;

    } catch (err) {
        console.log(err);
    }
}

const passwordCompare = async (password: string, hashedPassword: string) => {
    try {
        const comp = await bcrypt.compare(password, hashedPassword);
        return comp;

    } catch (err) {
        console.log(`error comparing password: ${err}`);
    }
}

export { hashingPassword, passwordCompare }