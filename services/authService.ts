import { User, DashboardData } from '../types';

const USER_DATA_KEY = 'vsi_user_data';
const USER_TOKEN_KEY = 'vsi_user_token';

// This function simulates a delay, as if we were making a real network request.
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Helper to get all users from our "database" (localStorage)
const getAllUsers = (): Record<string, User> => {
    const users = localStorage.getItem(USER_DATA_KEY);
    return users ? JSON.parse(users) : {};
};

// Helper to save users to our "database"
const saveAllUsers = (users: Record<string, User>) => {
    localStorage.setItem(USER_DATA_KEY, JSON.stringify(users));
};

export const register = async (name: string, email: string, password: string): Promise<User> => {
    await sleep(500);
    const users = getAllUsers();

    if (Object.values(users).some(user => user.email.toLowerCase() === email.toLowerCase())) {
        throw new Error('An account with this email already exists.');
    }

    const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        name,
        // Default empty profile
        college: '',
        skills: { languages: '', frameworks: '', tools: '', platforms: '', softSkills: '' },
        projects: '',
        certifications: '',
        gradYear: String(new Date().getFullYear() + 1),
        cgpa: '',
        linkedinUrl: '',
        githubUrl: '',
    };

    // In a real backend, you would securely hash the password here.
    // For this simulation, we'll store it in a way that's not directly on the user object.
    const newUserWithPass = { ...newUser, password };
    users[newUser.id] = newUserWithPass;
    saveAllUsers(users);

    // Simulate creating a session token
    localStorage.setItem(USER_TOKEN_KEY, newUser.id);

    // Return the user object without the password
    const { password: _, ...userToReturn } = newUserWithPass;
    return userToReturn;
};

export const login = async (email: string, password: string): Promise<User> => {
    await sleep(500);
    const users = getAllUsers();
    
    const userRecord = Object.values(users).find(
        (user: any) => user.email.toLowerCase() === email.toLowerCase() && user.password === password
    );

    if (!userRecord) {
        throw new Error('Invalid email or password.');
    }
    
    // Simulate creating a session token
    localStorage.setItem(USER_TOKEN_KEY, userRecord.id);

    // Return the user object without the password
    const { password: _, ...userToReturn } = userRecord as any;
    return userToReturn;
};

export const logout = () => {
    localStorage.removeItem(USER_TOKEN_KEY);
};

export const getCurrentUser = (): User | null => {
    const userId = localStorage.getItem(USER_TOKEN_KEY);
    if (!userId) return null;

    const users = getAllUsers();
    const userRecord = users[userId];

    if (!userRecord) {
        // Token is invalid or user was deleted
        logout();
        return null;
    }

    const { password, ...userToReturn } = userRecord as any;
    return userToReturn;
};

export const updateProfile = async (userId: string, data: DashboardData): Promise<User> => {
    await sleep(300);
    const users = getAllUsers();
    const currentUser = users[userId];

    if (!currentUser) {
        throw new Error('User not found.');
    }

    // Update the user's profile data, keeping auth details like id, email, password
    const updatedUser = {
        ...currentUser,
        ...data,
    };

    users[userId] = updatedUser;
    saveAllUsers(users);

    const { password, ...userToReturn } = updatedUser as any;
    return userToReturn;
}
