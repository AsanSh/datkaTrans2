import { useForm } from '@mantine/form';
import { TextInput, Button, Paper, Title, Container, Text } from '@mantine/core';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useTelegram } from '../hooks/useTelegram';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function RegistrationForm() {
  const { user, tg } = useTelegram();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const form = useForm({
    initialValues: {
      name: user?.first_name || '',
      phone: '',
      telegram_id: user?.id?.toString() || '',
    },
    validate: {
      name: (value) => (value.length < 2 ? 'Name must be at least 2 characters' : null),
      phone: (value) => (/^\+?[0-9]{10,}$/.test(value) ? null : 'Invalid phone number'),
      telegram_id: (value) => (value ? null : 'Telegram ID is required'),
    },
  });

  useEffect(() => {
    tg.ready();
    tg.MainButton.setParams({
      text: 'REGISTER',
    });
  }, []);

  const handleSubmit = async (values: typeof form.values) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      await axios.post(`${API_URL}/register`, values);
      setSubmitStatus('success');
      form.reset();
      // Close the Telegram Web App after successful registration
      setTimeout(() => {
        tg.close();
      }, 2000);
    } catch (error) {
      console.error('Registration error:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size="xs" mt="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mb="lg">
          Employee Registration
        </Title>

        <form onSubmit={form.onSubmit(handleSubmit)}>
          <TextInput
            required
            label="Full Name"
            placeholder="Enter your full name"
            {...form.getInputProps('name')}
          />

          <TextInput
            required
            mt="md"
            label="Phone Number"
            placeholder="+1234567890"
            {...form.getInputProps('phone')}
          />

          <TextInput
            required
            mt="md"
            label="Telegram ID"
            placeholder="Your Telegram ID"
            disabled
            {...form.getInputProps('telegram_id')}
          />

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={isSubmitting}
          >
            Register
          </Button>

          {submitStatus === 'success' && (
            <Text c="green" ta="center" mt="md">
              Registration request sent successfully!
            </Text>
          )}

          {submitStatus === 'error' && (
            <Text c="red" ta="center" mt="md">
              Registration failed. Please try again.
            </Text>
          )}
        </form>
      </Paper>
    </Container>
  );
} 