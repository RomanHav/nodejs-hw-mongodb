import createHttpError from 'http-errors';
import { User } from '../db/models/user';
import bcrypt from 'bcrypt';
import { randomBytes } from 'crypto';
import { Session } from '../db/models/session';
import { FIFTEEN_MINUTES, ONE_MONTH } from '../constants';

export const registerUser = async (payload) => {
  const user = await User.findOne({ email: payload.email });
  if (user) {
    createHttpError(409, 'Email in use!');
  }
  const encryptedPassword = await bcrypt.hash(payload.password, 10);
  return await User.create({ ...payload, encryptedPassword });
};

export const loginUser = async (payload) => {
    const user = await User.findOne({ email: payload.email });
    if (!user) {
        throw createHttpError(404, 'User not found!');
    }
    const isEqual = await bcrypt.compare(payload.password, user.password);
    if (!isEqual) {
        throw createHttpError(401, 'Invalid password!');
    }
    await Session.deleteOne({userId: user._id});

    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');

    return await Session.create({
        userId: user._id,
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
    });

};

const createSession = () => {
    const accessToken = randomBytes(30).toString('base64');
    const refreshToken = randomBytes(30).toString('base64');
    return {
        accessToken,
        refreshToken,
        accessTokenValidUntil: new Date(Date.now() + FIFTEEN_MINUTES),
        refreshTokenValidUntil: new Date(Date.now() + ONE_MONTH),
    };
};

export const refreshUserSession = async ({sessionId, refreshToken}) => {
    const session = await Session.findOne({
        _id: sessionId,
        refreshToken,
    });
    if (!session) {
        throw createHttpError(401, 'Invalid refresh token!');
    }
    const isSessionTokenExpired = new Date() > new Date(session.refreshTokenValidUntil);
    if (isSessionTokenExpired) {
        throw createHttpError(401, 'Refresh token has expired!');
    };
    const newSession = createSession();
    await Session.deleteOne({ _id: session._id, refreshToken });
    return await Session.create({
        userId: session.userId,
        ...newSession,
    });
};
export const logoutUser = async (sessionId) => {
    await Session.deleteOne({_id: sessionId});
};
