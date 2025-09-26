import { useState, useCallback } from "react";
import validator from "email-validator";

/**
 * Validates user form data
 * @param {Object} formData - The form data to validate
 * @param {Object} options - Validation options
 * @param {boolean} options.includePassword - Whether to validate password field
 * @returns {Object} - Object containing validation errors
 */
const validateUserForm = (formData, options = {}) => {
  const { includePassword = false } = options;
  const errors = {};

  const requiredFields = {
    firstName: "First name",
    lastName: "Last name",
    username: "Username",
    phone: "Phone number",
    ...(includePassword && { password: "Password" }),
  };

  // Check required fields
  Object.entries(requiredFields).forEach(([field, label]) => {
    if (!formData[field]) {
      errors[field] = `${label} is required`;
    }
  });

  // Email validation (only if email is provided)
  if (formData.email && !validator.validate(formData.email)) {
    errors.email = "Enter a valid email address";
  }

  return errors;
};

/**
 * Custom hook for form validation
 * @param {Object} initialValues - Initial form values
 * @param {Object} options - Validation options
 * @returns {Object} - Form validation state and functions
 */
export const useUserFormValidation = (initialValues, options = {}) => {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // Handle field change
  const handleChange = useCallback(
    (field, value) => {
      setValues((prev) => ({ ...prev, [field]: value }));

      // Clear error when user starts typing
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: "" }));
      }
    },
    [errors],
  );

  // Validate form
  const validateForm = useCallback(() => {
    const newErrors = validateUserForm(values, options);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, options]);

  // Reset form
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  // Set field value programmatically
  const setFieldValue = useCallback((field, value) => {
    setValues((prev) => ({ ...prev, [field]: value }));
  }, []);

  return {
    values,
    errors,
    handleChange,
    validateForm,
    resetForm,
    setFieldValue,
    isValid: Object.keys(errors).length === 0,
  };
};
