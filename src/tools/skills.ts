import { readSkills } from "../utils/files";

export const getAvailableSkills = async () => {
    return await readSkills();
};
