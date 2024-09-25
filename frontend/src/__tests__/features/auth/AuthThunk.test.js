import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import MockAdapter from 'axios-mock-adapter';
import api from '../../../api/api';
import { updateUser, registerUser, deleteUser, loginUser } from '../../../features/auth/authThunks';

const middlewares = [thunk]; 
const mockStore = configureMockStore(middlewares); 
const mock = new MockAdapter(api);

describe('authThunks', () => {
    let store;

    beforeEach(() => {
        store = mockStore({
            auth: { token: 'mocked-jwt-token' } 
        });
    });

    afterEach(() => {
        mock.reset(); 
    });

    test('dispatches fulfilled action when updating user is successful', async () => {
        const userData = { id: 1, username: 'updatedUser' };  
        const mockResponse = { id: 1, username: 'updatedUser' };  


        mock.onPut(`/users/${userData.id}`).reply(200, mockResponse);

        const result = await store.dispatch(updateUser(userData));

        const actions = store.getActions();
        console.log('Actions dispatched:', actions);

        expect(result.type).toBe('auth/updateUser/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });

    test('dispatches fulfilled action when registration is successful', async () => {
        const userData = { username: 'newUser', password: 'password123' };  // Registration data
        const mockResponse = { user: { id: 1, username: 'newUser' }, token: 'mocked-jwt-token' };
    
        // Mock POST request
        mock.onPost('/auth/register').reply(200, mockResponse);
    
        const result = await store.dispatch(registerUser(userData));
    
        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);
    
        expect(result.type).toBe('auth/registerUser/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });

    test('dispatches fulfilled action when login is successful', async () => {
        const credentials = { username: 'testuser', password: 'password123' };
        const mockResponse = { user: { id: 1, username: 'testuser' }, token: 'mocked-jwt-token' };
    
        // Mock POST request
        mock.onPost('/auth/login').reply(200, mockResponse);
    
        const result = await store.dispatch(loginUser(credentials));
    
        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);
    
        expect(result.type).toBe('auth/loginUser/fulfilled');
        expect(result.payload).toEqual(mockResponse);
    });

    test('dispatches fulfilled action when deleting user is successful', async () => {
        const userId = 1;
    
        // Mock DELETE request
        mock.onDelete(`/users/${userId}`).reply(200);
    
        const result = await store.dispatch(deleteUser(userId));
    
        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);
    
        expect(result.type).toBe('auth/deleteUser/fulfilled');
        expect(result.payload).toBe(userId);
    });

    test('dispatches rejected action when registration fails', async () => {
        const userData = { username: 'newUser', password: 'password123' };
        const mockError = { message: 'Registration failed' };
    
        // Mock POST request with error
        mock.onPost('/auth/register').reply(400, mockError);
    
        const result = await store.dispatch(registerUser(userData));
    
        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);
    
        expect(result.type).toBe('auth/registerUser/rejected');
        expect(result.payload).toBe(mockError.message);
    });

    test('dispatches rejected action when login fails', async () => {
        const credentials = { username: 'testuser', password: 'wrongpassword' };
        const mockError = { message: 'Login failed' };
    
        // Mock POST request with error
        mock.onPost('/auth/login').reply(400, mockError);
    
        const result = await store.dispatch(loginUser(credentials));
    
        const actions = store.getActions(); 
        console.log('Actions dispatched:', actions);
    
        expect(result.type).toBe('auth/loginUser/rejected');
        expect(result.payload).toBe(mockError.message);
    });
    
    
});
