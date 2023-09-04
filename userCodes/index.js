const crypto = require('crypto');

// Função para criar uma hash SHA-256 da senha
function sha256Hash(password, salt) {
  const hash = crypto.createHmac('sha256', salt);
  hash.update(password);
  const hashedPassword = hash.digest('hex');
  return hashedPassword;
}

// Senha que o usuário fornece ao se cadastrar
const senhaDoUsuario = 'BLK@0303';

// Gerar um salt (um valor aleatório usado para criar a hash)
const salt = crypto.randomBytes(16).toString('hex');

// Criptografar a senha
const senhaCriptografada = sha256Hash(senhaDoUsuario, salt);

console.log('Senha criptografada em SHA-256:', senhaCriptografada);
console.log('Salt:', salt);