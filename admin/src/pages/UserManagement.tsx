import { useEffect, useState } from "react";
import axios from "axios";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, MoreVertical, UserPlus } from "lucide-react";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch users from Flask backend
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/users")
      .then((res) => {
        if (res.data.success) {
          setUsers(res.data.users);
        }
      })
      .catch((err) => {
        console.error("Error fetching users:", err);
      });
  }, []);

  const filteredUsers = users.filter((user) =>
    (user.name || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
    (user.email || "")
      .toLowerCase()
      .includes(searchTerm.toLowerCase())
  );

  const activeUsers = users.filter((user) => user.status === "Active").length;
  const adminUsers = users.filter((user) => user.role === "Admin").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
        <p className="text-muted-foreground">
          Manage your application users and their permissions
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {users.length}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {activeUsers}
            </div>
          </CardContent>
        </Card>

        <Card className="admin-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Admin Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-700 dark:text-purple-400">
              {adminUsers}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-card">
        <CardHeader>
          <CardTitle>User List</CardTitle>
          <CardDescription>View and manage all registered users</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6 items-start sm:items-center justify-between">
            <div className="relative w-full sm:w-auto">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search users..."
                className="pl-10 w-full sm:w-80"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button className="bg-purple-600 hover:bg-purple-700 text-white">
              <UserPlus className="mr-2 h-4 w-4" />
              Add User
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Name</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Role</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Status</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-muted-foreground">Last Login</th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filteredUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium">{user.name}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{user.email}</td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant={user.role === "Admin" ? "default" : "secondary"}
                        className={user.role === "Admin" ? "bg-purple-600" : ""}
                      >
                        {user.role || "User"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <Badge
                        variant={user.status === "Active" ? "outline" : "secondary"}
                        className={
                          user.status === "Active"
                            ? "border-green-500 text-green-600 dark:border-green-500 dark:text-green-400"
                            : "bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400"
                        }
                      >
                        {user.status || "Active"}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">
                      {user.lastLogin || "N/A"}
                    </td>
                    <td className="px-4 py-3 text-sm text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="rounded-full">
                            <MoreVertical className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit User</DropdownMenuItem>
                          <DropdownMenuItem>Change Role</DropdownMenuItem>
                          <DropdownMenuItem className={user.status === "Active" ? "text-amber-600" : "text-green-600"}>
                            {user.status === "Active" ? "Deactivate" : "Activate"}
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {filteredUsers.length === 0 && (
              <div className="py-12 text-center text-muted-foreground">
                No users found matching your search.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
