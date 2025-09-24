import { Title, Text, Button, Container, Group, Box, Stack, rem } from '@mantine/core';
import { Link } from 'react-router-dom';

function WelcomePage() {
  return (
    // Boxコンポーネントで全画面のコンテナを作成
    <Box
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        // モダンなグラデーション背景
        background: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
      }}
    >
      <Container size="md">
        {/* Stackで要素を縦に並べ、間隔を調整 */}
        <Stack align="center" gap="xl">
          <Title
            order={1}
            style={{
              fontSize: rem(60), // rem関数でレスポンシブなフォントサイズ
              fontWeight: 900,
              letterSpacing: rem(-2),
              color: '#FFFFFF',
              textAlign: 'center',
              lineHeight: 1.1,
            }}
          >
            Due-Log
          </Title>

          <Text c="gray.4" size="xl" ta="center" maw={580}>
             日々の振り込み管理を、もっとシンプルに。
                  会社の生産性を次のレベルへ。
          </Text>

          <Group justify="center" mt="lg">
            <Button
              component={Link}
              to="/register"
              size="xl"
              radius="xl"
              // ボタンにもグラデーションを適用
              variant="gradient"
              gradient={{ from: 'blue', to: 'cyan' }}
            >
              Register
            </Button>
            <Button
              component={Link}
              to="/login"
              variant="default"
              size="xl"
              radius="xl"
            >
              Login
            </Button>
          </Group>
        </Stack>
      </Container>
    </Box>
  );
}

export default WelcomePage;