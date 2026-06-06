export interface ValidationResult {
  nameError: string | null;
  phoneError: string | null;
  hasError: boolean;
}

export const validateCheckoutForm = (name: string, phoneNumber: string): ValidationResult => {
  const trimmedName = name.trim();
  const trimmedPhone = phoneNumber.trim();

  const nameError = trimmedName ? null : "Nama wajib diisi";
  let phoneError: string | null = null;

  if (!trimmedPhone) {
    phoneError = "Nomor wajib diisi";
  } else if (!/^[0-9]+$/.test(trimmedPhone)) {
    phoneError = "Nomor harus berupa angka";
  }

  return {
    nameError,
    phoneError,
    hasError: Boolean(nameError || phoneError),
  };
};

