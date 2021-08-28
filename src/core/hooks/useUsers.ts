import { useCallback, useState } from 'react';
import { User, UserService } from 'rodolfohiok-sdk';

export default function useUsers() {
  const [users, setUsers] = useState<User.Summary[]>([]);

  const fetchUsers = useCallback(() => {
    UserService.getAllUsers().then(setUsers);
  }, []);

  return {
    users,
    fetchUsers,
  };
}
