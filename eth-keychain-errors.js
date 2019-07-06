class KeychainError extends Error { }

class PrivateKeyLoadError extends KeychainError {
  constructor() { super("PrivateKeyLoadError: Failed to load Private key") }
}

module.exports = {
  KeychainError: KeychainError,
  PrivateKeyLoadError: PrivateKeyLoadError,
}
