export const Auth = {
    currentSession : jest.fn(()=> Promise.resolve()),
    signIn: jest.fn(()=> Promise.resolve()),
    signOut: jest.fn(()=> Promise.resolve())
};

export const Storage = {
    list : jest.fn(()=> Promise.resolve(["foo"]))
};