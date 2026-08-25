import { body, param, query, ValidationChain, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: (err as any).path,
        message: err.msg
      }))
    });
    return;
  }
  next();
};

export const validateRegistration: ValidationChain[] = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('name').notEmpty().withMessage('Name is required'),
  body('role').optional().isIn(['citizen', 'university', 'industry', 'government', 'admin', 'expert']).withMessage('Invalid role')
];

export const validateLogin: ValidationChain[] = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required')
];

export const validateChallenge: ValidationChain[] = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('location.state').notEmpty().withMessage('State is required')
];

export const validateSolution: ValidationChain[] = [
  body('title').notEmpty().withMessage('Title is required'),
  body('challenge').notEmpty().withMessage('Challenge ID is required'),
  body('problemAddressed').notEmpty().withMessage('Problem addressed is required'),
  body('proposedApproach').notEmpty().withMessage('Proposed approach is required')
];

export const validateOrganization: ValidationChain[] = [
  body('name').notEmpty().withMessage('Name is required'),
  body('type').isIn(['university', 'industry', 'government', 'ngo']).withMessage('Invalid organization type'),
  body('contactEmail').isEmail().withMessage('Valid contact email is required'),
  body('address.city').notEmpty().withMessage('City is required'),
  body('address.state').notEmpty().withMessage('State is required')
];

export const validateEvaluation: ValidationChain[] = [
  body('solution').notEmpty().withMessage('Solution ID is required'),
  body('scores.impact').isFloat({ min: 0, max: 10 }).withMessage('Impact score must be between 0-10'),
  body('scores.feasibility').isFloat({ min: 0, max: 10 }).withMessage('Feasibility score must be between 0-10'),
  body('scores.scalability').isFloat({ min: 0, max: 10 }).withMessage('Scalability score must be between 0-10'),
  body('scores.innovation').isFloat({ min: 0, max: 10 }).withMessage('Innovation score must be between 0-10'),
  body('scores.costEffectiveness').isFloat({ min: 0, max: 10 }).withMessage('Cost effectiveness score must be between 0-10'),
  body('recommendation').isIn(['approve', 'approve-with-conditions', 'revise', 'reject']).withMessage('Invalid recommendation')
];

export const validateIdParam: ValidationChain[] = [
  param('id').isMongoId().withMessage('Invalid ID format')
];
