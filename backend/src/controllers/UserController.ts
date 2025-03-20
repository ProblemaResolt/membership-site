import { Request, Response } from 'express';
import { hash, compare } from 'bcrypt';
import { AuthRequest } from '../types/auth.js';
import User from '../models/User.js';

export const updateProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { firstName, lastName, phone, prefecture, city, address } = req.body;
    
    await User.update(
      {
        firstName,
        lastName,
        phone,
        prefecture,
        city,
        address
      },
      {
        where: { id: req.user.id }
      }
    );

    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Profile update failed' });
  }
};

export const changePassword = async (req: AuthRequest, res: Response) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findByPk(req.user.id);

    if (!user || !await compare(currentPassword, user.get('password'))) {
      return res.status(401).json({ error: 'Current password is incorrect' });
    }

    const hashedPassword = await hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Password change failed' });
  }
};
