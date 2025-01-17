import express, { Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.route';
import workspaceRoutes from './routes/workspace.route';
import channelRoutes from './routes/channel.route';
import channelMemberRoutes from './routes/channelMember.route';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

app.use(express.json())

app.use(cors());

app.use('/api/auth', authRoutes);

app.use('/api/workspace', workspaceRoutes);

app.use('/api/workspace', channelRoutes);

app.use('/api/workspace/channel', channelMemberRoutes);

// Basic health check route
app.get('/', (req: Request, res: Response) => {
    res.send('Server is running');
});

app.listen(5000, () => {
    console.log(`Server is running on PORT 5000!`);
})
