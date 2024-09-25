import authReducer, { logout, setToken, setUser } from '../../../features/auth/authSlice';
import { registerUser, loginUser, updateUser, deleteUser } from '../../../features/auth/authThunks';

describe('authSlice reducers and extra reducers', () => {
    const initialState = {
        user: null,
        token: null,
        status: 'idle',
        error: null,
    };

    beforeEach(() => {
        jest.spyOn(console, 'log').mockImplementation(() => {});

        Storage.prototype.setItem = jest.fn();
        Storage.prototype.removeItem = jest.fn();
    });

    afterEach(() => {
        console.log.mockRestore();
    });

    it('should return the initial state', () => {
        expect(authReducer(undefined, { type: undefined })).toEqual(initialState);
    });

    it('should handle logout', () => {
        const previousState = { ...initialState, user: { id: 1 }, token: 'abc' };
        const state = authReducer(previousState, logout());
        expect(state).toEqual({
            ...initialState,
            user: null,
            token: null,
        });
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });

    it('should handle setToken', () => {
        const state = authReducer(initialState, setToken('new-token'));
        expect(state.token).toEqual('new-token');
    });

    it('should handle setUser', () => {
        const user = { id: 1, name: 'John' };
        const state = authReducer(initialState, setUser(user));
        expect(state.user).toEqual(user);
    });

    it('should handle registerUser.pending', () => {
        const action = { type: registerUser.pending.type };
        const state = authReducer(initialState, action);
        expect(state.status).toBe('loading');
    });

    it('should handle registerUser.fulfilled', () => {
        const action = {
            type: registerUser.fulfilled.type,
            payload: {
                user: { id: 1, name: 'John' },
                token: 'abc',
            },
        };
        const state = authReducer(initialState, action);
        expect(state).toEqual({
            user: { id: 1, name: 'John' },
            token: 'abc',
            status: 'succeeded',
            error: null,
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(action.payload.user));
        expect(localStorage.setItem).toHaveBeenCalledWith('token', action.payload.token);
    });

    it('should handle registerUser.rejected', () => {
        const action = { type: registerUser.rejected.type, error: { message: 'Failed to register' } };
        const state = authReducer(initialState, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to register');
    });

    it('should handle loginUser.fulfilled', () => {
        const action = {
            type: loginUser.fulfilled.type,
            payload: {
                user: { id: 1, name: 'John' },
                token: 'abc',
            },
        };
        const state = authReducer(initialState, action);
        expect(state).toEqual({
            user: { id: 1, name: 'John' },
            token: 'abc',
            status: 'succeeded',
            error: null,
        });
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(action.payload.user));
        expect(localStorage.setItem).toHaveBeenCalledWith('token', action.payload.token);
    });

    it('should handle loginUser.rejected', () => {
        const action = { type: loginUser.rejected.type, error: { message: 'Failed to login' } };
        const state = authReducer(initialState, action);
        expect(state.status).toBe('failed');
        expect(state.error).toBe('Failed to login');
    });

    it('should handle updateUser.fulfilled', () => {
        const action = {
            type: updateUser.fulfilled.type,
            payload: { id: 1, name: 'Updated User' },
        };
        const state = authReducer(initialState, action);
        expect(state.user).toEqual(action.payload);
        expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(action.payload));
    });

    it('should handle deleteUser.fulfilled', () => {
        const action = { type: deleteUser.fulfilled.type };
        const state = authReducer(initialState, action);
        expect(state.user).toBeNull();
        expect(state.token).toBeNull();
        expect(localStorage.removeItem).toHaveBeenCalledWith('user');
        expect(localStorage.removeItem).toHaveBeenCalledWith('token');
    });
});
