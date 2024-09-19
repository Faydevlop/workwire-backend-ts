import express from 'express';
import Message from './chatModel'; // Update with the correct path
import Admin from '../admin/models/adminModel';

const router = express.Router();

router.get('/messages/:sender/:receiver', async (req, res) => {
  const { sender, receiver } = req.params;
  try {
    const messages = await Message.find({
      $or: [
        { sender, receiver },
        { sender: receiver, receiver: sender }
      ]
    }).sort({ timestamp: 1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});


router.get('/adminlist',async(req,res)=>{
    try {
        const admins = await Admin.find()

        if(!admins){
            res.status(200).json({message:'admins not fouund'})
            return
        }
        console.log(admins);
        
    
        res.status(200).json({admins})
        
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch admin data' });
    }

   

})

export default router;
