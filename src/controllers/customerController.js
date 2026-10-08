const { findCustomerProfileByUserId, createCustomerProfile, updateCustomerProfile } = require('../models/customerModel');
const AppError = require('../utils/AppError');
const asyncHandler = require('../utils/asyncHandler');

const getProfile = asyncHandler(async (req, res) => {
  const profile = await findCustomerProfileByUserId(req.user.id);

  if (!profile) {
    throw new AppError('Customer profile not found', 404);
  }

  res.json({ success: true, profile });
});

const updateProfile = asyncHandler(async (req, res) => {
  const { company_name, billing_email, address, tax_id } = req.body;
  const currentProfile = await findCustomerProfileByUserId(req.user.id);

  if (!currentProfile) {
    throw new AppError('Customer profile not found. Create one first via registration flow.', 404);
  }

  const updatedProfile = await updateCustomerProfile(req.user.id, {
    company_name,
    billing_email,
    address,
    tax_id,
  });

  res.json({ success: true, profile: updatedProfile });
});

module.exports = {
  getProfile,
  updateProfile,
};
