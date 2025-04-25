import { useState } from 'react';
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface LoginProps {
  onLoginSuccess: () => void;
}

export function AdminLogin({ onLoginSuccess }: LoginProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      username: '',
      password: '',
    },
    validate: {
      username: (value) => (value.length < 1 ? 'Username is required' : null),
      password: (value) => (value.length < 1 ? 'Password is required' : null),
    },
  });

  const handleSubmit = async (values: typeof form.values) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post(`${API_URL}/admin/login`, values);
      const { access_token } = response.data;
      localStorage.setItem('adminToken', access_token);
      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError('Invalid username or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mb="lg">
          Admin Login
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Username"
            placeholder="Enter username"
            {...form.getInputProps('username')}
          />

          <PasswordInput
            required
            mt="md"
            label="Password"
            placeholder="Enter password"
            {...form.getInputProps('password')}
          />

          {error && (
            <Text c="red" size="sm" ta="center" mt="sm">
              {error}
            </Text>
          )}

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={isLoading}
          >
            Login
          </Button>
        </form>
      </Paper>
    </Container>
  );
} 