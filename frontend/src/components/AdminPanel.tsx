import { useState, useEffect } from 'react';
import { Table, Button, Group, Text, Paper, Container, Title } from '@mantine/core';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface User {
  telegram_id: string;
  name: string;
  phone: string;
  status: string;
  created_at: string;
}

export function AdminPanel() {
  const [requests, setRequests] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRequests = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await axios.get(`${API_URL}/admin/requests`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setRequests(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch requests');
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const handleAction = async (telegram_id: string, action: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem('adminToken');
      await axios.post(
        `${API_URL}/admin/${action}/${telegram_id}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchRequests(); // Refresh the list
    } catch (err) {
      console.error(`Error ${action}ing request:`, err);
      setError(`Failed to ${action} request`);
    }
  };

  if (loading) {
    return <Text>Loading...</Text>;
  }

  if (error) {
    return <Text c="red">{error}</Text>;
  }

  return (
    <Container size="lg" mt="xl">
      <Paper radius="md" p="xl" withBorder>
        <Title order={2} ta="center" mb="lg">
          Pending Registration Requests
        </Title>

        {requests.length === 0 ? (
          <Text ta="center">No pending requests</Text>
        ) : (
          <Table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Telegram ID</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((request) => (
                <tr key={request.telegram_id}>
                  <td>{request.name}</td>
                  <td>{request.phone}</td>
                  <td>{request.telegram_id}</td>
                  <td>{new Date(request.created_at).toLocaleDateString()}</td>
                  <td>
                    <Group gap="xs">
                      <Button
                        size="xs"
                        color="green"
                        onClick={() => handleAction(request.telegram_id, 'approve')}
                      >
                        Approve
                      </Button>
                      <Button
                        size="xs"
                        color="red"
                        onClick={() => handleAction(request.telegram_id, 'reject')}
                      >
                        Reject
                      </Button>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Paper>
    </Container>
  );
} 