import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Mail,
  Phone,
  Building,
  DollarSign,
} from "lucide-react";

interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  avatar?: string;
  totalBilled: number;
  status: "active" | "inactive";
}

interface Payment {
  id: string;
  invoiceNumber: string;
  date: string;
  amount: number;
  status: "paid" | "pending" | "overdue";
}

const ClientSection = () => {
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddClientDialogOpen, setIsAddClientDialogOpen] = useState(false);

  // Mock data for clients
  const defaultClients: Client[] = [
    {
      id: "1",
      name: "Jane Cooper",
      email: "jane@example.com",
      phone: "(555) 123-4567",
      company: "Acme Inc",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=jane",
      totalBilled: 12500,
      status: "active",
    },
    {
      id: "2",
      name: "Alex Johnson",
      email: "alex@example.com",
      phone: "(555) 987-6543",
      company: "Tech Solutions",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=alex",
      totalBilled: 8750,
      status: "active",
    },
    {
      id: "3",
      name: "Michael Brown",
      email: "michael@example.com",
      phone: "(555) 456-7890",
      company: "Design Studio",
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
      totalBilled: 5200,
      status: "inactive",
    },
  ];

  const [clients, setClients] = useState<Client[]>(defaultClients);

  // Mock data for payment history
  const defaultPayments: Payment[] = [
    {
      id: "p1",
      invoiceNumber: "INV-001",
      date: "2023-05-15",
      amount: 2500,
      status: "paid",
    },
    {
      id: "p2",
      invoiceNumber: "INV-002",
      date: "2023-06-20",
      amount: 3000,
      status: "paid",
    },
    {
      id: "p3",
      invoiceNumber: "INV-003",
      date: "2023-07-10",
      amount: 1500,
      status: "pending",
    },
    {
      id: "p4",
      invoiceNumber: "INV-004",
      date: "2023-08-05",
      amount: 2000,
      status: "overdue",
    },
  ];

  const [payments, setPayments] = useState<Payment[]>(defaultPayments);

  const handleClientSelect = (client: Client) => {
    setSelectedClient(client);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredClients = clients.filter(
    (client) =>
      client.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would add the client to the database
    setIsAddClientDialogOpen(false);
  };

  const handleEditClient = () => {
    // In a real app, this would update the client in the database
    console.log("Edit client:", selectedClient);
  };

  const handleDeleteClient = () => {
    // In a real app, this would delete the client from the database
    if (selectedClient) {
      setClients(clients.filter((client) => client.id !== selectedClient.id));
      setSelectedClient(null);
    }
  };

  const getStatusColor = (status: Payment["status"]) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "";
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Clients</h2>
        <div className="flex space-x-4">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <Input
              placeholder="Search clients..."
              className="pl-10 w-64"
              value={searchQuery}
              onChange={handleSearch}
            />
          </div>
          <Dialog
            open={isAddClientDialogOpen}
            onOpenChange={setIsAddClientDialogOpen}
          >
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2" size={16} />
                Add Client
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Client</DialogTitle>
                <DialogDescription>
                  Enter the details of your new client. Click save when you're
                  done.
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleAddClient}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="name" className="text-right font-medium">
                      Name
                    </label>
                    <Input id="name" className="col-span-3" required />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="email" className="text-right font-medium">
                      Email
                    </label>
                    <Input
                      id="email"
                      type="email"
                      className="col-span-3"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="phone" className="text-right font-medium">
                      Phone
                    </label>
                    <Input id="phone" className="col-span-3" />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="company" className="text-right font-medium">
                      Company
                    </label>
                    <Input id="company" className="col-span-3" />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Save Client</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Client List */}
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="bg-gray-50 p-3 border-b">
            <h3 className="font-medium">Client List</h3>
          </div>
          <div className="max-h-[500px] overflow-y-auto">
            {filteredClients.length > 0 ? (
              <ul className="divide-y">
                {filteredClients.map((client) => (
                  <li
                    key={client.id}
                    className={`p-4 cursor-pointer hover:bg-gray-50 ${selectedClient?.id === client.id ? "bg-blue-50" : ""}`}
                    onClick={() => handleClientSelect(client)}
                  >
                    <div className="flex items-center">
                      <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={client.avatar} alt={client.name} />
                        <AvatarFallback>{client.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{client.name}</p>
                        <p className="text-sm text-gray-500">
                          {client.company}
                        </p>
                      </div>
                      <Badge variant="outline" className="ml-auto">
                        {client.status === "active" ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-6 text-center text-gray-500">
                No clients found matching your search.
              </div>
            )}
          </div>
        </div>

        {/* Client Details */}
        <div className="md:col-span-2">
          {selectedClient ? (
            <Card>
              <CardHeader className="flex flex-row items-start justify-between">
                <div>
                  <CardTitle>{selectedClient.name}</CardTitle>
                  <CardDescription>{selectedClient.company}</CardDescription>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleEditClient}
                  >
                    <Edit size={16} className="mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteClient}
                  >
                    <Trash2 size={16} className="mr-2" />
                    Delete
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="details">
                  <TabsList className="mb-4">
                    <TabsTrigger value="details">Details</TabsTrigger>
                    <TabsTrigger value="payment-history">
                      Payment History
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="details">
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <Mail className="text-gray-500 mr-2" size={18} />
                        <span>{selectedClient.email}</span>
                      </div>
                      <div className="flex items-center">
                        <Phone className="text-gray-500 mr-2" size={18} />
                        <span>{selectedClient.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Building className="text-gray-500 mr-2" size={18} />
                        <span>{selectedClient.company}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="text-gray-500 mr-2" size={18} />
                        <span>
                          Total Billed: $
                          {selectedClient.totalBilled.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="payment-history">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Invoice #</TableHead>
                          <TableHead>Date</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {payments.map((payment) => (
                          <TableRow key={payment.id}>
                            <TableCell>{payment.invoiceNumber}</TableCell>
                            <TableCell>
                              {new Date(payment.date).toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              ${payment.amount.toLocaleString()}
                            </TableCell>
                            <TableCell>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(payment.status)}`}
                              >
                                {payment.status.charAt(0).toUpperCase() +
                                  payment.status.slice(1)}
                              </span>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <div className="h-full flex items-center justify-center border rounded-lg p-8">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">No Client Selected</h3>
                <p className="text-gray-500 mb-4">
                  Select a client from the list to view their details
                </p>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="mr-2" size={16} />
                      Add New Client
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add New Client</DialogTitle>
                      <DialogDescription>
                        Enter the details of your new client. Click save when
                        you're done.
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddClient}>
                      <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="name-empty"
                            className="text-right font-medium"
                          >
                            Name
                          </label>
                          <Input
                            id="name-empty"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="email-empty"
                            className="text-right font-medium"
                          >
                            Email
                          </label>
                          <Input
                            id="email-empty"
                            type="email"
                            className="col-span-3"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="phone-empty"
                            className="text-right font-medium"
                          >
                            Phone
                          </label>
                          <Input id="phone-empty" className="col-span-3" />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <label
                            htmlFor="company-empty"
                            className="text-right font-medium"
                          >
                            Company
                          </label>
                          <Input id="company-empty" className="col-span-3" />
                        </div>
                      </div>
                      <DialogFooter>
                        <Button type="submit">Save Client</Button>
                      </DialogFooter>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientSection;
