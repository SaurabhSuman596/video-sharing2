import Video from '../models/Video';
import User from '../models/User';
import createError from '../error';

// Add video

export const addVideo = async (req, res, next) => {
  try {
    const newVideo = new Video({ userId: req.user.id, ...req.body });
    const savedVideo = await newVideo.save();
    res.status(200).json(savedVideo);
  } catch {
    (err) => next(err);
  }
};

// Update Video

export const updateVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, 'Video Not Found!'));
    }
    if (video.userId === req.user.id) {
      await Video.findByIdAndUpdate(
        req.params.id,
        {
          $set: req.body,
        },
        { new: true }
      );
      res.status(200).json('Video Updated Successfully!');
    } else {
      return next(createError(403, 'You can only update your video!'));
    }
  } catch {
    (err) => next(err);
  }
};

// delete your video

export const deleteVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    if (!video) {
      return next(createError(404, 'Video not found!'));
    }

    if (video.userId === req.user.id) {
      await Video.findByIdAndDelete(req.params.id);
      res.status(200).json('This video has been deleted!');
    } else {
      return next(createError(403, 'You can delete only your video!'));
    }
  } catch {
    (err) => next(err);
  }
};

// Get video

export const getVideo = async (req, res, next) => {
  try {
    const video = await Video.findById(req.params.id);
    res.status(200).json(video);
  } catch {
    (err) => next(err);
  }
};

// AddView

export const addView = async (req, res, next) => {
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $inc: { views: 1 },
    });
    res.status(200).json('The view has been increased!');
  } catch {
    (err) => next(err);
  }
};

// random video

export const random = async (req, res, next) => {
  try {
    const videos = await Video.aggregate([{ $sample: { size: 40 } }]);
    res.status(200).json(videos);
  } catch {
    (err) => next(err);
  }
};

export const trend = async (req, res, next) => {
  try {
    const videos = await Video.find().sort({ views: -1 });
    res.status(200).json(videos);
  } catch {
    (err) => next(err);
  }
};

export const sub = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    const subscribedChannel = user.subsCribedUsers;

    const list = await Promise.all(
      subscribedChannel.map(async (channelId) => {
        return await Video.find({ userId: channelId });
      })
    );
    res.status(200).json(list.flat().sort((a, b) => b.createdAt - a.createdAt));
  } catch {
    (err) => next(err);
  }
};

// getBytag

export const getByTag = async (req, res, next) => {
  const tags = req.query.tags.split(',');
  try {
    const videos = await Video.find({ tags: { $in: tags } }).limit(20);
    res.status(200).json(videos);
  } catch {
    (err) => next(err);
  }
};

// Search

export const search = async (req, res, next) => {
  const query = req.query.q;
  try {
    const videos = await Video.find({
      title: { $regex: query, $options: 'i' },
    }).limit(40);
    res.status(200).json(videos);
  } catch {
    (err) => next(err);
  }
};

// Likes/Dislikes

export const like = async (req, res, next) => {
  const userId = req.user.id;
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $push: { likes: userId },
      $pull: { disLikes: userId },
    });
    res.status(200).json('This video has been liked!');
  } catch {
    (err) => next(err);
  }
};

export const dislike = async (req, res, next) => {
  const id = req.user.id;
  try {
    await Video.findByIdAndUpdate(req.params.id, {
      $puhs: { dislike: id },
      $pull: { likes: id },
    });
    res.status(200).json('This video has been disliked!');
  } catch {
    (err) => next(err);
  }
};
