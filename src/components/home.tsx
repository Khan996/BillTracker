import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  FileText,
  DollarSign,
  Users,
  BarChart,
  Settings,
  LogOut,
  User,
  Upload,
  Crown,
  TrendingUp,
} from "lucide-react";
import SummaryCards from "./SummaryCards";
import InvoiceSection from "./InvoiceSection";
import ExpenseSection from "./ExpenseSection";
import ClientSection from "./ClientSection";

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isProfileDialogOpen, setIsProfileDialogOpen] = useState(false);
  const [userProfile, setUserProfile] = useState({
    businessName: "Freelance Pro",
    ownerName: "John Doe",
    email: "john@freelancepro.com",
    phone: "+1 (555) 123-4567",
    address: "123 Business St, City, State 12345",
    website: "www.freelancepro.com",
    taxId: "12-3456789",
    logo: "https://api.dicebear.com/7.x/avataaars/svg?seed=business",
    invoiceSettings: {
      showBusinessName: true,
      showOwnerName: true,
      showEmail: true,
      showPhone: true,
      showAddress: true,
      showWebsite: true,
      showTaxId: false,
      showLogo: true,
    },
  });

  // Mock top clients data
  const topClients = [
    {
      id: "1",
      name: "Acme Corp",
      totalBilled: 15000,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=acme",
      status: "active" as const,
    },
    {
      id: "2",
      name: "Tech Solutions",
      totalBilled: 12500,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=tech",
      status: "active" as const,
    },
    {
      id: "3",
      name: "StartupXYZ",
      totalBilled: 8750,
      avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=startup",
      status: "active" as const,
    },
  ];

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r bg-card p-4 flex flex-col justify-between">
        <div>
          <div className="flex items-center mb-8">
            <DollarSign className="h-8 w-8 text-primary mr-2" />
            <h1 className="text-xl font-bold">Finance Tracker</h1>
          </div>

          <nav className="space-y-2">
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("dashboard")}
            >
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button
              variant={activeTab === "invoices" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("invoices")}
            >
              <FileText className="mr-2 h-4 w-4" />
              Invoices
            </Button>
            <Button
              variant={activeTab === "expenses" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("expenses")}
            >
              <DollarSign className="mr-2 h-4 w-4" />
              Expenses
            </Button>
            <Button
              variant={activeTab === "clients" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("clients")}
            >
              <Users className="mr-2 h-4 w-4" />
              Clients
            </Button>
            <Button
              variant={activeTab === "reports" ? "default" : "ghost"}
              className="w-full justify-start"
              onClick={() => setActiveTab("reports")}
            >
              <BarChart className="mr-2 h-4 w-4" />
              Reports
            </Button>
          </nav>
        </div>

        <div className="space-y-2">
          <Dialog
            open={isProfileDialogOpen}
            onOpenChange={setIsProfileDialogOpen}
          >
            <DialogTrigger asChild>
              <Button variant="ghost" className="w-full justify-start">
                <User className="mr-2 h-4 w-4" />
                Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Business Profile</DialogTitle>
                <DialogDescription>
                  Manage your business details and invoice settings.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src={userProfile.logo} alt="Business Logo" />
                    <AvatarFallback>BL</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <Button variant="outline" size="sm">
                      <Upload className="mr-2 h-4 w-4" />
                      Upload Logo
                    </Button>
                    <p className="text-xs text-muted-foreground mt-1">
                      Recommended: 200x200px, PNG or JPG
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      value={userProfile.businessName}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          businessName: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name</Label>
                    <Input
                      id="ownerName"
                      value={userProfile.ownerName}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          ownerName: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={userProfile.email}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          email: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={userProfile.phone}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          phone: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={userProfile.address}
                    onChange={(e) =>
                      setUserProfile({
                        ...userProfile,
                        address: e.target.value,
                      })
                    }
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="website">Website</Label>
                    <Input
                      id="website"
                      value={userProfile.website}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          website: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="taxId">Tax ID</Label>
                    <Input
                      id="taxId"
                      value={userProfile.taxId}
                      onChange={(e) =>
                        setUserProfile({
                          ...userProfile,
                          taxId: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label>Invoice Display Settings</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries({
                      showBusinessName: "Business Name",
                      showOwnerName: "Owner Name",
                      showEmail: "Email",
                      showPhone: "Phone",
                      showAddress: "Address",
                      showWebsite: "Website",
                      showTaxId: "Tax ID",
                      showLogo: "Logo",
                    }).map(([key, label]) => (
                      <div key={key} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={key}
                          checked={
                            userProfile.invoiceSettings[
                              key as keyof typeof userProfile.invoiceSettings
                            ]
                          }
                          onChange={(e) =>
                            setUserProfile({
                              ...userProfile,
                              invoiceSettings: {
                                ...userProfile.invoiceSettings,
                                [key]: e.target.checked,
                              },
                            })
                          }
                          className="rounded"
                        />
                        <Label htmlFor={key} className="text-sm">
                          {label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button onClick={() => setIsProfileDialogOpen(false)}>
                  Save Changes
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
          <Button variant="ghost" className="w-full justify-start">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-8">
            <h1 className="text-3xl font-bold">Welcome back, Freelancer</h1>
            <p className="text-muted-foreground">
              Here's an overview of your finances
            </p>
          </header>

          <SummaryCards />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-8">
            <TabsList className="grid w-full grid-cols-4 mb-8">
              <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              <TabsTrigger value="invoices">Invoices</TabsTrigger>
              <TabsTrigger value="expenses">Expenses</TabsTrigger>
              <TabsTrigger value="clients">Clients</TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard">
              <div className="space-y-6">
                {/* Financial Overview Chart */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-2xl font-semibold mb-4">
                      Financial Overview
                    </h2>
                    <div className="h-64 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-md p-4 flex flex-col justify-between">
                      {/* Mock Chart Area */}
                      <div className="flex justify-between items-end h-full">
                        {/* Income bars */}
                        <div className="flex items-end space-x-2 h-full">
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 bg-green-500 rounded-t"
                              style={{ height: "60%" }}
                            ></div>
                            <span className="text-xs mt-1">Jan</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 bg-green-500 rounded-t"
                              style={{ height: "80%" }}
                            ></div>
                            <span className="text-xs mt-1">Feb</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 bg-green-500 rounded-t"
                              style={{ height: "70%" }}
                            ></div>
                            <span className="text-xs mt-1">Mar</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 bg-green-500 rounded-t"
                              style={{ height: "90%" }}
                            ></div>
                            <span className="text-xs mt-1">Apr</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 bg-green-500 rounded-t"
                              style={{ height: "85%" }}
                            ></div>
                            <span className="text-xs mt-1">May</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div
                              className="w-8 bg-green-500 rounded-t"
                              style={{ height: "95%" }}
                            ></div>
                            <span className="text-xs mt-1">Jun</span>
                          </div>
                        </div>

                        {/* Legend */}
                        <div className="flex flex-col space-y-2 text-sm">
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-green-500 rounded mr-2"></div>
                            <span>Income</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-3 h-3 bg-red-500 rounded mr-2"></div>
                            <span>Expenses</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Recent Invoices
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">Invoice #001</p>
                            <p className="text-sm text-muted-foreground">
                              Acme Corp
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              $2,500.00
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Paid
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">Invoice #002</p>
                            <p className="text-sm text-muted-foreground">
                              Tech Solutions
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-orange-600">
                              $1,800.00
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Pending
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">Invoice #003</p>
                            <p className="text-sm text-muted-foreground">
                              StartupXYZ
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-green-600">
                              $3,200.00
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Paid
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-4">
                        Recent Expenses
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">Office Supplies</p>
                            <p className="text-sm text-muted-foreground">
                              Business
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">-$125.50</p>
                            <p className="text-xs text-muted-foreground">
                              Jan 15
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">Software License</p>
                            <p className="text-sm text-muted-foreground">
                              Technology
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">-$299.00</p>
                            <p className="text-xs text-muted-foreground">
                              Jan 12
                            </p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-muted/50 rounded">
                          <div>
                            <p className="font-medium">Client Lunch</p>
                            <p className="text-sm text-muted-foreground">
                              Meals
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-red-600">-$85.75</p>
                            <p className="text-xs text-muted-foreground">
                              Jan 10
                            </p>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-lg font-semibold">
                        Top Clients
                      </CardTitle>
                      <Crown className="h-5 w-5 text-yellow-500" />
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {topClients.map((client, index) => (
                          <div
                            key={client.id}
                            className="flex items-center justify-between p-3 bg-muted/50 rounded"
                          >
                            <div className="flex items-center space-x-3">
                              <div className="flex items-center space-x-2">
                                <span className="text-sm font-bold text-muted-foreground">
                                  #{index + 1}
                                </span>
                                <Avatar className="h-8 w-8">
                                  <AvatarImage
                                    src={client.avatar}
                                    alt={client.name}
                                  />
                                  <AvatarFallback>
                                    {client.name.charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {client.name}
                                </p>
                                <Badge variant="outline" className="text-xs">
                                  {client.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-medium text-green-600">
                                ${client.totalBilled.toLocaleString()}
                              </p>
                              <div className="flex items-center text-xs text-muted-foreground">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                Total billed
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Quick Actions */}
                <Card>
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">
                      Quick Actions
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <Button
                        className="h-20 flex flex-col space-y-2"
                        onClick={() => setActiveTab("invoices")}
                      >
                        <FileText className="h-6 w-6" />
                        <span>New Invoice</span>
                      </Button>
                      <Button
                        className="h-20 flex flex-col space-y-2"
                        onClick={() => setActiveTab("expenses")}
                      >
                        <DollarSign className="h-6 w-6" />
                        <span>Add Expense</span>
                      </Button>
                      <Button
                        className="h-20 flex flex-col space-y-2"
                        onClick={() => setActiveTab("clients")}
                      >
                        <Users className="h-6 w-6" />
                        <span>New Client</span>
                      </Button>
                      <Button
                        className="h-20 flex flex-col space-y-2"
                        onClick={() => setActiveTab("reports")}
                      >
                        <BarChart className="h-6 w-6" />
                        <span>View Reports</span>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="invoices">
              <InvoiceSection />
            </TabsContent>

            <TabsContent value="expenses">
              <ExpenseSection />
            </TabsContent>

            <TabsContent value="clients">
              <ClientSection />
            </TabsContent>

            <TabsContent value="reports">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4">Reports</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Button className="h-24 text-lg">Income Report</Button>
                      <Button className="h-24 text-lg">Expense Report</Button>
                      <Button className="h-24 text-lg">
                        Profit/Loss Report
                      </Button>
                      <Button className="h-24 text-lg">Client Report</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
