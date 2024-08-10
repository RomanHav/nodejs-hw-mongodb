import { ONE_MONTH } from '../constants';
import { loginUser, refreshUserSession, registerUser, logoutUser } from '../services/auth';

export const registerUserController = async (req, res) => {
  const user = await registerUser(req.body);

  req.status(201).json({
    status: 201,
    message: 'Successfully registered a user!',
    data: user,
  });
};
export const loginUserController = async (req, res) => {
  const session = await loginUser(req.body);
  res.cookie('refreshToken', session.refreshToken, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
  res.cookie('sessionId', session._id, {
    httpOnly: true,
    expires: new Date(Date.now() + ONE_MONTH),
  });
  res.status(200).json({
    status: 200,
    message: 'Successfully logged in!',
    data: {
      accessToken: session.accessToken,
    },
  });
};

const setupSession = (res, session) => {
    res.cookie('refreshToken', session.refreshToken, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_MONTH),
      });
      res.cookie('sessionId', session._id, {
        httpOnly: true,
        expires: new Date(Date.now() + ONE_MONTH),
      });
};
export const refreshUserController = async (req, res) => {
    const session = await refreshUserSession({
        sessionId: req.cookies.sessionId,
        refreshToken: req.cookies.refreshToken,
    });
    setupSession(res, session);
    res.status(200).json({
        status: 200,
        message: 'Successfully refreshed session!',
        data: {
            accessToken: session.accessToken,
        },
    });
};
export const logoutUserController = async (req, res) => {
    if (req.cookies.sessionId){
        await logoutUser(req.cookies.sessionId);
    }
    res.clearCookie('sessionId');
    res.clearCookie('refreshToken');

    res.status(204).send();
};
