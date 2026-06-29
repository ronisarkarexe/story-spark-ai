import { Request, Response } from 'express';

/**
 * Character feature is temporarily disabled because the Character model is missing.
 * These endpoints are kept to avoid breaking routes, but return safe responses.
 */

export const createCharacter = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Character feature temporarily disabled (missing model)',
    });
  } catch (error) {
    console.error('Create character error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getCharacters = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Character feature temporarily disabled (missing model)',
    });
  } catch (error) {
    console.error('Get characters error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const getCharacterById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Character feature temporarily disabled (missing model)',
    });
  } catch (error) {
    console.error('Get character error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const updateCharacter = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Character feature temporarily disabled (missing model)',
    });
  } catch (error) {
    console.error('Update character error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const deleteCharacter = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    return res.status(501).json({
      success: false,
      message: 'Character feature temporarily disabled (missing model)',
    });
  } catch (error) {
    console.error('Delete character error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};