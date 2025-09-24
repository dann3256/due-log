import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  TextInput, 
  PasswordInput, 
  Button, 
  Paper, 
  Title, 
  Container, 
  Text,
  Anchor,
  Stack,
  Alert,
  Box, // Boxコンポーネントを追加
} from '@mantine/core';
import { IconAlertCircle } from '@tabler/icons-react';

function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:8080/register', {
        name: username,
        email: email,
        password_hash: password,
      });
      alert('登録が完了しました！ログインページに移動します。');
      navigate('/login');
    } catch (err) {
      console.error('Registration failed:', err);
      setError('このメールアドレスは既に使用されているか、入力内容が正しくありません。');
    }
  };

  return (
    // WelcomePageと同じBoxで全体を囲む
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      }}
    >
      <Container size={420} my={40}>
        {/* 文字色を白に変更 */}
        <Title ta="center" c="white">
          アカウントを作成
        </Title>
        <Text c="dimmed" size="sm" ta="center" mt={5}>
          アカウントを既にお持ちですか？{' '}
          <Anchor size="sm" component="a" href="/login">
            ログイン
          </Anchor>
        </Text>

        <Paper withBorder shadow="md" p={30} mt={30} radius="md">
          <form onSubmit={handleSubmit}>
            <Stack>
              <TextInput required label="Username" placeholder="Your username" value={username} onChange={(event) => setUsername(event.currentTarget.value)} radius="md"/>
              <TextInput required label="Email" placeholder="your@email.com" value={email} onChange={(event) => setEmail(event.currentTarget.value)} radius="md"/>
              <PasswordInput required label="Password" placeholder="Your password" value={password} onChange={(event) => setPassword(event.currentTarget.value)} radius="md"/>
            </Stack>
            {error && (<Alert icon={<IconAlertCircle size="1rem" />} title="エラー" color="red" mt="md" radius="md">{error}</Alert>)}
            <Button fullWidth mt="xl" type="submit" radius="md">
              登録する
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  );
}

export default RegisterPage;