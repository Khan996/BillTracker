import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import {
  CalendarIcon,
  Download,
  FileText,
  Plus,
  Search,
  Trash2,
  Edit,
  Send,
  Repeat,
  Bell,
  Globe,
  DollarSign,
  Euro,
  PoundSterling,
  Yen,
} from "lucide-react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  client: string;
  amount: number;
  date: Date;
  dueDate: Date;
  status: "paid" | "pending" | "overdue";
  items: InvoiceItem[];
  currency: string;
  taxRate: number;
  isRecurring: boolean;
  recurringFrequency?: "weekly" | "monthly" | "quarterly" | "yearly";
  nextDueDate?: Date;
  reminderSent: boolean;
  reminderDays: number;
}

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

const currencies: Currency[] = [
  { code: "USD", symbol: "$", name: "US Dollar" },
  { code: "EUR", symbol: "€", name: "Euro" },
  { code: "GBP", symbol: "£", name: "British Pound" },
  { code: "JPY", symbol: "¥", name: "Japanese Yen" },
  { code: "CAD", symbol: "C$", name: "Canadian Dollar" },
  { code: "AUD", symbol: "A$", name: "Australian Dollar" },
  { code: "CHF", symbol: "CHF", name: "Swiss Franc" },
  { code: "CNY", symbol: "¥", name: "Chinese Yuan" },
  { code: "INR", symbol: "₹", name: "Indian Rupee" },
  { code: "KRW", symbol: "₩", name: "South Korean Won" },
  { code: "BRL", symbol: "R$", name: "Brazilian Real" },
  { code: "MXN", symbol: "$", name: "Mexican Peso" },
  { code: "RUB", symbol: "₽", name: "Russian Ruble" },
  { code: "ZAR", symbol: "R", name: "South African Rand" },
  { code: "SGD", symbol: "S$", name: "Singapore Dollar" },
  { code: "HKD", symbol: "HK$", name: "Hong Kong Dollar" },
  { code: "NOK", symbol: "kr", name: "Norwegian Krone" },
  { code: "SEK", symbol: "kr", name: "Swedish Krona" },
  { code: "DKK", symbol: "kr", name: "Danish Krone" },
  { code: "PLN", symbol: "zł", name: "Polish Zloty" },
  { code: "CZK", symbol: "Kč", name: "Czech Koruna" },
  { code: "HUF", symbol: "Ft", name: "Hungarian Forint" },
  { code: "ILS", symbol: "₪", name: "Israeli Shekel" },
  { code: "AED", symbol: "د.إ", name: "UAE Dirham" },
  { code: "SAR", symbol: "﷼", name: "Saudi Riyal" },
  { code: "TRY", symbol: "₺", name: "Turkish Lira" },
  { code: "EGP", symbol: "£", name: "Egyptian Pound" },
  { code: "THB", symbol: "฿", name: "Thai Baht" },
  { code: "MYR", symbol: "RM", name: "Malaysian Ringgit" },
  { code: "IDR", symbol: "Rp", name: "Indonesian Rupiah" },
  { code: "PHP", symbol: "₱", name: "Philippine Peso" },
  { code: "VND", symbol: "₫", name: "Vietnamese Dong" },
  { code: "TWD", symbol: "NT$", name: "Taiwan Dollar" },
  { code: "NZD", symbol: "NZ$", name: "New Zealand Dollar" },
  { code: "CLP", symbol: "$", name: "Chilean Peso" },
  { code: "COP", symbol: "$", name: "Colombian Peso" },
  { code: "PEN", symbol: "S/", name: "Peruvian Sol" },
  { code: "ARS", symbol: "$", name: "Argentine Peso" },
  { code: "UYU", symbol: "$U", name: "Uruguayan Peso" },
  { code: "BOB", symbol: "Bs", name: "Bolivian Boliviano" },
  { code: "PYG", symbol: "₲", name: "Paraguayan Guarani" },
  { code: "GHS", symbol: "₵", name: "Ghanaian Cedi" },
  { code: "NGN", symbol: "₦", name: "Nigerian Naira" },
  { code: "KES", symbol: "KSh", name: "Kenyan Shilling" },
  { code: "UGX", symbol: "USh", name: "Ugandan Shilling" },
  { code: "TZS", symbol: "TSh", name: "Tanzanian Shilling" },
  { code: "ETB", symbol: "Br", name: "Ethiopian Birr" },
  { code: "MAD", symbol: "د.م.", name: "Moroccan Dirham" },
  { code: "TND", symbol: "د.ت", name: "Tunisian Dinar" },
  { code: "DZD", symbol: "د.ج", name: "Algerian Dinar" },
  { code: "LYD", symbol: "ل.د", name: "Libyan Dinar" },
  { code: "SDG", symbol: "ج.س.", name: "Sudanese Pound" },
  { code: "XOF", symbol: "CFA", name: "West African CFA Franc" },
  { code: "XAF", symbol: "FCFA", name: "Central African CFA Franc" },
  { code: "AFN", symbol: "؋", name: "Afghan Afghani" },
  { code: "ALL", symbol: "L", name: "Albanian Lek" },
  { code: "AMD", symbol: "֏", name: "Armenian Dram" },
  { code: "AOA", symbol: "Kz", name: "Angolan Kwanza" },
  { code: "AWG", symbol: "ƒ", name: "Aruban Florin" },
  { code: "AZN", symbol: "₼", name: "Azerbaijani Manat" },
  { code: "BAM", symbol: "KM", name: "Bosnia-Herzegovina Convertible Mark" },
  { code: "BBD", symbol: "$", name: "Barbadian Dollar" },
  { code: "BDT", symbol: "৳", name: "Bangladeshi Taka" },
  { code: "BGN", symbol: "лв", name: "Bulgarian Lev" },
  { code: "BHD", symbol: ".د.ب", name: "Bahraini Dinar" },
  { code: "BIF", symbol: "FBu", name: "Burundian Franc" },
  { code: "BMD", symbol: "$", name: "Bermudan Dollar" },
  { code: "BND", symbol: "$", name: "Brunei Dollar" },
  { code: "BSD", symbol: "$", name: "Bahamian Dollar" },
  { code: "BTN", symbol: "Nu.", name: "Bhutanese Ngultrum" },
  { code: "BWP", symbol: "P", name: "Botswanan Pula" },
  { code: "BYN", symbol: "Br", name: "Belarusian Ruble" },
  { code: "BZD", symbol: "BZ$", name: "Belize Dollar" },
  { code: "CDF", symbol: "FC", name: "Congolese Franc" },
  { code: "CRC", symbol: "₡", name: "Costa Rican Colón" },
  { code: "CUC", symbol: "$", name: "Cuban Convertible Peso" },
  { code: "CUP", symbol: "₱", name: "Cuban Peso" },
  { code: "CVE", symbol: "$", name: "Cape Verdean Escudo" },
  { code: "DJF", symbol: "Fdj", name: "Djiboutian Franc" },
  { code: "DOP", symbol: "RD$", name: "Dominican Peso" },
  { code: "ERN", symbol: "Nfk", name: "Eritrean Nakfa" },
  { code: "FJD", symbol: "$", name: "Fijian Dollar" },
  { code: "FKP", symbol: "£", name: "Falkland Islands Pound" },
  { code: "GEL", symbol: "₾", name: "Georgian Lari" },
  { code: "GGP", symbol: "£", name: "Guernsey Pound" },
  { code: "GIP", symbol: "£", name: "Gibraltar Pound" },
  { code: "GMD", symbol: "D", name: "Gambian Dalasi" },
  { code: "GNF", symbol: "FG", name: "Guinean Franc" },
  { code: "GTQ", symbol: "Q", name: "Guatemalan Quetzal" },
  { code: "GYD", symbol: "$", name: "Guyanaese Dollar" },
  { code: "HNL", symbol: "L", name: "Honduran Lempira" },
  { code: "HRK", symbol: "kn", name: "Croatian Kuna" },
  { code: "HTG", symbol: "G", name: "Haitian Gourde" },
  { code: "IMP", symbol: "£", name: "Isle of Man Pound" },
  { code: "IQD", symbol: "ع.د", name: "Iraqi Dinar" },
  { code: "IRR", symbol: "﷼", name: "Iranian Rial" },
  { code: "ISK", symbol: "kr", name: "Icelandic Króna" },
  { code: "JEP", symbol: "£", name: "Jersey Pound" },
  { code: "JMD", symbol: "J$", name: "Jamaican Dollar" },
  { code: "JOD", symbol: "JD", name: "Jordanian Dinar" },
  { code: "KGS", symbol: "лв", name: "Kyrgystani Som" },
  { code: "KHR", symbol: "៛", name: "Cambodian Riel" },
  { code: "KMF", symbol: "CF", name: "Comorian Franc" },
  { code: "KPW", symbol: "₩", name: "North Korean Won" },
  { code: "KWD", symbol: "KD", name: "Kuwaiti Dinar" },
  { code: "KYD", symbol: "$", name: "Cayman Islands Dollar" },
  { code: "KZT", symbol: "₸", name: "Kazakhstani Tenge" },
  { code: "LAK", symbol: "₭", name: "Laotian Kip" },
  { code: "LBP", symbol: "£", name: "Lebanese Pound" },
  { code: "LKR", symbol: "₨", name: "Sri Lankan Rupee" },
  { code: "LRD", symbol: "$", name: "Liberian Dollar" },
  { code: "LSL", symbol: "M", name: "Lesotho Loti" },
  { code: "MDL", symbol: "lei", name: "Moldovan Leu" },
  { code: "MGA", symbol: "Ar", name: "Malagasy Ariary" },
  { code: "MKD", symbol: "ден", name: "Macedonian Denar" },
  { code: "MMK", symbol: "K", name: "Myanmar Kyat" },
  { code: "MNT", symbol: "₮", name: "Mongolian Tugrik" },
  { code: "MOP", symbol: "MOP$", name: "Macanese Pataca" },
  { code: "MRU", symbol: "UM", name: "Mauritanian Ouguiya" },
  { code: "MUR", symbol: "₨", name: "Mauritian Rupee" },
  { code: "MVR", symbol: "Rf", name: "Maldivian Rufiyaa" },
  { code: "MWK", symbol: "MK", name: "Malawian Kwacha" },
  { code: "MZN", symbol: "MT", name: "Mozambican Metical" },
  { code: "NAD", symbol: "$", name: "Namibian Dollar" },
  { code: "NIO", symbol: "C$", name: "Nicaraguan Córdoba" },
  { code: "NPR", symbol: "₨", name: "Nepalese Rupee" },
  { code: "OMR", symbol: "﷼", name: "Omani Rial" },
  { code: "PAB", symbol: "B/.", name: "Panamanian Balboa" },
  { code: "PKR", symbol: "₨", name: "Pakistani Rupee" },
  { code: "QAR", symbol: "﷼", name: "Qatari Rial" },
  { code: "RON", symbol: "lei", name: "Romanian Leu" },
  { code: "RSD", symbol: "Дин.", name: "Serbian Dinar" },
  { code: "RWF", symbol: "R₣", name: "Rwandan Franc" },
  { code: "SBD", symbol: "$", name: "Solomon Islands Dollar" },
  { code: "SCR", symbol: "₨", name: "Seychellois Rupee" },
  { code: "SHP", symbol: "£", name: "Saint Helena Pound" },
  { code: "SLE", symbol: "Le", name: "Sierra Leonean Leone" },
  { code: "SOS", symbol: "S", name: "Somali Shilling" },
  { code: "SRD", symbol: "$", name: "Surinamese Dollar" },
  { code: "STN", symbol: "Db", name: "São Tomé and Príncipe Dobra" },
  { code: "SVC", symbol: "$", name: "Salvadoran Colón" },
  { code: "SYP", symbol: "£", name: "Syrian Pound" },
  { code: "SZL", symbol: "E", name: "Swazi Lilangeni" },
  { code: "TJS", symbol: "SM", name: "Tajikistani Somoni" },
  { code: "TMT", symbol: "T", name: "Turkmenistani Manat" },
  { code: "TOP", symbol: "T$", name: "Tongan Paʻanga" },
  { code: "TTD", symbol: "TT$", name: "Trinidad and Tobago Dollar" },
  { code: "TVD", symbol: "$", name: "Tuvaluan Dollar" },
  { code: "UAH", symbol: "₴", name: "Ukrainian Hryvnia" },
  { code: "UZS", symbol: "лв", name: "Uzbekistan Som" },
  { code: "VES", symbol: "Bs", name: "Venezuelan Bolívar" },
  { code: "VUV", symbol: "VT", name: "Vanuatu Vatu" },
  { code: "WST", symbol: "WS$", name: "Samoan Tala" },
  { code: "XCD", symbol: "$", name: "East Caribbean Dollar" },
  { code: "XDR", symbol: "SDR", name: "Special Drawing Rights" },
  { code: "XPF", symbol: "₣", name: "CFP Franc" },
  { code: "YER", symbol: "﷼", name: "Yemeni Rial" },
  { code: "ZMW", symbol: "ZK", name: "Zambian Kwacha" },
  { code: "ZWL", symbol: "Z$", name: "Zimbabwean Dollar" },
];

const taxRates = [
  { label: "No Tax", rate: 0 },
  { label: "1%", rate: 1 },
  { label: "2%", rate: 2 },
  { label: "3%", rate: 3 },
  { label: "4%", rate: 4 },
  { label: "5%", rate: 5 },
  { label: "6%", rate: 6 },
  { label: "7%", rate: 7 },
  { label: "8%", rate: 8 },
  { label: "8.5%", rate: 8.5 },
  { label: "9%", rate: 9 },
  { label: "10%", rate: 10 },
  { label: "11%", rate: 11 },
  { label: "12%", rate: 12 },
  { label: "13%", rate: 13 },
  { label: "14%", rate: 14 },
  { label: "15%", rate: 15 },
  { label: "16%", rate: 16 },
  { label: "17%", rate: 17 },
  { label: "18%", rate: 18 },
  { label: "19%", rate: 19 },
  { label: "20%", rate: 20 },
  { label: "21%", rate: 21 },
  { label: "22%", rate: 22 },
  { label: "23%", rate: 23 },
  { label: "24%", rate: 24 },
  { label: "25%", rate: 25 },
  { label: "26%", rate: 26 },
  { label: "27%", rate: 27 },
  { label: "28%", rate: 28 },
  { label: "29%", rate: 29 },
  { label: "30%", rate: 30 },
  { label: "Custom", rate: -1 },
];

const InvoiceSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [invoiceDate, setInvoiceDate] = useState<Date | undefined>(new Date());
  const [invoiceDueDate, setInvoiceDueDate] = useState<Date | undefined>(
    new Date(),
  );
  const [selectedCurrency, setSelectedCurrency] = useState("USD");
  const [selectedTaxRate, setSelectedTaxRate] = useState(8.5);
  const [isRecurring, setIsRecurring] = useState(false);
  const [recurringFrequency, setRecurringFrequency] = useState("monthly");
  const [reminderDays, setReminderDays] = useState(7);
  const [autoReminders, setAutoReminders] = useState(true);

  // Mock data for invoices
  const mockInvoices: Invoice[] = [
    {
      id: "1",
      invoiceNumber: "INV-001",
      client: "Acme Corp",
      amount: 1500.0,
      date: new Date("2023-05-15"),
      dueDate: new Date("2023-06-15"),
      status: "paid",
      currency: "USD",
      taxRate: 8.5,
      isRecurring: false,
      reminderSent: false,
      reminderDays: 7,
      items: [
        {
          description: "Website Design",
          quantity: 1,
          rate: 1000,
          amount: 1000,
        },
        { description: "Logo Design", quantity: 1, rate: 500, amount: 500 },
      ],
    },
    {
      id: "2",
      invoiceNumber: "INV-002",
      client: "Globex Inc",
      amount: 2200.0,
      date: new Date("2023-06-01"),
      dueDate: new Date("2023-07-01"),
      status: "pending",
      currency: "EUR",
      taxRate: 20,
      isRecurring: true,
      recurringFrequency: "monthly",
      nextDueDate: new Date("2023-08-01"),
      reminderSent: false,
      reminderDays: 5,
      items: [
        {
          description: "Mobile App Development",
          quantity: 10,
          rate: 150,
          amount: 1500,
        },
        { description: "UI/UX Design", quantity: 7, rate: 100, amount: 700 },
      ],
    },
    {
      id: "3",
      invoiceNumber: "INV-003",
      client: "Initech LLC",
      amount: 800.0,
      date: new Date("2023-04-10"),
      dueDate: new Date("2023-05-10"),
      status: "overdue",
      currency: "GBP",
      taxRate: 20,
      isRecurring: false,
      reminderSent: true,
      reminderDays: 3,
      items: [
        {
          description: "SEO Optimization",
          quantity: 1,
          rate: 800,
          amount: 800,
        },
      ],
    },
  ];

  // Filter invoices based on active tab and search query
  const filteredInvoices = mockInvoices
    .filter((invoice) => {
      if (activeTab === "all") return true;
      return invoice.status === activeTab;
    })
    .filter((invoice) => {
      if (!searchQuery) return true;
      return (
        invoice.invoiceNumber
          .toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        invoice.client.toLowerCase().includes(searchQuery.toLowerCase())
      );
    });

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleCreateInvoice = () => {
    // Handle invoice creation logic
    console.log("Creating invoice with:", {
      currency: selectedCurrency,
      taxRate: selectedTaxRate,
      isRecurring,
      recurringFrequency: isRecurring ? recurringFrequency : undefined,
      reminderDays,
      autoReminders,
    });
    setIsCreateDialogOpen(false);
  };

  const getCurrencySymbol = (currencyCode: string) => {
    const currency = currencies.find((c) => c.code === currencyCode);
    return currency?.symbol || "$";
  };

  const formatAmount = (amount: number, currencyCode: string) => {
    const symbol = getCurrencySymbol(currencyCode);
    return `${symbol}${amount.toFixed(2)}`;
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <Tabs defaultValue="all" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-6">
          <TabsList>
            <TabsTrigger value="all">All Invoices</TabsTrigger>
            <TabsTrigger value="paid">Paid</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="overdue">Overdue</TabsTrigger>
          </TabsList>

          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search invoices..."
                className="pl-8 w-64"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex space-x-2">
              <Dialog
                open={isCreateDialogOpen}
                onOpenChange={setIsCreateDialogOpen}
              >
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    New Invoice
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[800px]">
                  <DialogHeader>
                    <DialogTitle>Create New Invoice</DialogTitle>
                    <DialogDescription>
                      Fill in the details to create a new invoice. Click save
                      when you're done.
                    </DialogDescription>
                  </DialogHeader>

                  <div className="grid grid-cols-2 gap-4 py-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="invoiceNumber">Invoice Number</Label>
                        <Input id="invoiceNumber" placeholder="INV-001" />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="client">Client</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select client" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="acme">Acme Corp</SelectItem>
                            <SelectItem value="globex">Globex Inc</SelectItem>
                            <SelectItem value="initech">Initech LLC</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-2">
                          <Label htmlFor="currency">Currency</Label>
                          <Select
                            value={selectedCurrency}
                            onValueChange={setSelectedCurrency}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {currencies.map((currency) => (
                                <SelectItem
                                  key={currency.code}
                                  value={currency.code}
                                >
                                  {currency.symbol} {currency.code}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="taxRate">Tax Rate</Label>
                          <Select
                            value={selectedTaxRate.toString()}
                            onValueChange={(value) =>
                              setSelectedTaxRate(parseFloat(value))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {taxRates.map((tax) => (
                                <SelectItem
                                  key={tax.label}
                                  value={tax.rate.toString()}
                                >
                                  {tax.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label>Invoice Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {invoiceDate ? (
                                format(invoiceDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={invoiceDate}
                              onSelect={setInvoiceDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>

                      <div className="space-y-2">
                        <Label>Due Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-start text-left font-normal"
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {invoiceDueDate ? (
                                format(invoiceDueDate, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0">
                            <Calendar
                              mode="single"
                              selected={invoiceDueDate}
                              onSelect={setInvoiceDueDate}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="notes">Notes</Label>
                        <Textarea
                          id="notes"
                          placeholder="Additional notes or payment instructions"
                          className="h-20"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="template">Invoice Template</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="standard">
                              <div className="flex flex-col">
                                <span className="font-medium">Standard</span>
                                <span className="text-xs text-muted-foreground">
                                  Clean and professional layout
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="professional">
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  Professional
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  Corporate design with company branding
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="minimal">
                              <div className="flex flex-col">
                                <span className="font-medium">Minimal</span>
                                <span className="text-xs text-muted-foreground">
                                  Simple and clean design
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="modern">
                              <div className="flex flex-col">
                                <span className="font-medium">Modern</span>
                                <span className="text-xs text-muted-foreground">
                                  Contemporary design with bold typography
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="creative">
                              <div className="flex flex-col">
                                <span className="font-medium">Creative</span>
                                <span className="text-xs text-muted-foreground">
                                  Artistic layout for creative professionals
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="classic">
                              <div className="flex flex-col">
                                <span className="font-medium">Classic</span>
                                <span className="text-xs text-muted-foreground">
                                  Traditional business invoice format
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="elegant">
                              <div className="flex flex-col">
                                <span className="font-medium">Elegant</span>
                                <span className="text-xs text-muted-foreground">
                                  Sophisticated design with refined typography
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="bold">
                              <div className="flex flex-col">
                                <span className="font-medium">Bold</span>
                                <span className="text-xs text-muted-foreground">
                                  Eye-catching design with strong visual
                                  elements
                                </span>
                              </div>
                            </SelectItem>
                            <SelectItem value="compact">
                              <div className="flex flex-col">
                                <span className="font-medium">Compact</span>
                                <span className="text-xs text-muted-foreground">
                                  Space-efficient layout for detailed invoices
                                </span>
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="recurring"
                            checked={isRecurring}
                            onChange={(e) => setIsRecurring(e.target.checked)}
                            className="rounded"
                          />
                          <Label
                            htmlFor="recurring"
                            className="flex items-center"
                          >
                            <Repeat className="mr-2 h-4 w-4" />
                            Recurring Invoice
                          </Label>
                        </div>

                        {isRecurring && (
                          <div className="ml-6 space-y-2">
                            <Label htmlFor="frequency">Frequency</Label>
                            <Select
                              value={recurringFrequency}
                              onValueChange={setRecurringFrequency}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="weekly">Weekly</SelectItem>
                                <SelectItem value="monthly">Monthly</SelectItem>
                                <SelectItem value="quarterly">
                                  Quarterly
                                </SelectItem>
                                <SelectItem value="yearly">Yearly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>

                      <div className="space-y-3">
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id="autoReminders"
                            checked={autoReminders}
                            onChange={(e) => setAutoReminders(e.target.checked)}
                            className="rounded"
                          />
                          <Label
                            htmlFor="autoReminders"
                            className="flex items-center"
                          >
                            <Bell className="mr-2 h-4 w-4" />
                            Auto Payment Reminders
                          </Label>
                        </div>

                        {autoReminders && (
                          <div className="ml-6 space-y-2">
                            <Label htmlFor="reminderDays">
                              Remind (days before due)
                            </Label>
                            <Select
                              value={reminderDays.toString()}
                              onValueChange={(value) =>
                                setReminderDays(parseInt(value))
                              }
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="1">1 day</SelectItem>
                                <SelectItem value="3">3 days</SelectItem>
                                <SelectItem value="7">7 days</SelectItem>
                                <SelectItem value="14">14 days</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4 mt-4">
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-medium">Line Items</h3>
                      <Button size="sm" variant="outline">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Item
                      </Button>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[300px]">
                            Description
                          </TableHead>
                          <TableHead>Quantity</TableHead>
                          <TableHead>Rate</TableHead>
                          <TableHead>Amount</TableHead>
                          <TableHead className="w-[50px]"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>
                            <Input placeholder="Item description" />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="1"
                              className="w-20"
                            />
                          </TableCell>
                          <TableCell>
                            <Input
                              type="number"
                              placeholder="0.00"
                              className="w-24"
                            />
                          </TableCell>
                          <TableCell>
                            {getCurrencySymbol(selectedCurrency)}0.00
                          </TableCell>
                          <TableCell>
                            <Button variant="ghost" size="icon">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>

                    <div className="flex justify-end space-x-4 text-right">
                      <div className="space-y-1">
                        <p className="text-sm">Subtotal:</p>
                        <p className="text-sm">Tax ({selectedTaxRate}%):</p>
                        <p className="text-base font-medium">Total:</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm">
                          {getCurrencySymbol(selectedCurrency)}0.00
                        </p>
                        <p className="text-sm">
                          {getCurrencySymbol(selectedCurrency)}0.00
                        </p>
                        <p className="text-base font-medium">
                          {getCurrencySymbol(selectedCurrency)}0.00
                        </p>
                      </div>
                    </div>
                  </div>

                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleCreateInvoice}>
                      Create Invoice
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <Button variant="outline">
                <Repeat className="mr-2 h-4 w-4" />
                Recurring
              </Button>

              <Button variant="outline">
                <Bell className="mr-2 h-4 w-4" />
                Reminders
              </Button>
            </div>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>
                      Amount ({getCurrencySymbol(selectedCurrency)})
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <span>{invoice.invoiceNumber}</span>
                          {invoice.isRecurring && (
                            <Badge variant="outline" className="text-xs">
                              <Repeat className="h-3 w-3 mr-1" />
                              Recurring
                            </Badge>
                          )}
                          {invoice.reminderSent && (
                            <Badge variant="outline" className="text-xs">
                              <Bell className="h-3 w-3 mr-1" />
                              Reminded
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>
                        {formatAmount(invoice.amount, invoice.currency)}
                      </TableCell>
                      <TableCell>
                        {format(invoice.date, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(invoice.dueDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSelectedInvoice(invoice)}
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="paid" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>
                      Amount ({getCurrencySymbol(selectedCurrency)})
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(invoice.date, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(invoice.dueDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>
                      Amount ({getCurrencySymbol(selectedCurrency)})
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(invoice.date, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(invoice.dueDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="overdue" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>
                      Amount ({getCurrencySymbol(selectedCurrency)})
                    </TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Due Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.map((invoice) => (
                    <TableRow key={invoice.id}>
                      <TableCell>{invoice.invoiceNumber}</TableCell>
                      <TableCell>{invoice.client}</TableCell>
                      <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                      <TableCell>
                        {format(invoice.date, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        {format(invoice.dueDate, "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeColor(invoice.status)}>
                          {invoice.status.charAt(0).toUpperCase() +
                            invoice.status.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon">
                            <FileText className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Send className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Detail Dialog */}
      {selectedInvoice && (
        <Dialog
          open={!!selectedInvoice}
          onOpenChange={() => setSelectedInvoice(null)}
        >
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>Invoice {selectedInvoice.invoiceNumber}</DialogTitle>
              <DialogDescription>
                Issued to {selectedInvoice.client} on{" "}
                {format(selectedInvoice.date, "MMMM dd, yyyy")}
              </DialogDescription>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <h3 className="font-medium mb-2">From:</h3>
                <div className="flex items-start space-x-3">
                  <Avatar className="h-12 w-12">
                    <AvatarImage
                      src="https://api.dicebear.com/7.x/avataaars/svg?seed=business"
                      alt="Business Logo"
                    />
                    <AvatarFallback>BL</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">Freelance Pro</p>
                    <p className="text-sm text-muted-foreground">John Doe</p>
                    <p className="text-sm text-muted-foreground">
                      john@freelancepro.com
                    </p>
                    <p className="text-sm text-muted-foreground">
                      +1 (555) 123-4567
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Bill To:</h3>
                <p>{selectedInvoice.client}</p>
                <p>123 Client Street</p>
                <p>Client City, ST 12345</p>
              </div>

              <div className="text-right">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="font-medium">Invoice Number:</span>
                    <span>{selectedInvoice.invoiceNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Invoice Date:</span>
                    <span>{format(selectedInvoice.date, "MMM dd, yyyy")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Due Date:</span>
                    <span>
                      {format(selectedInvoice.dueDate, "MMM dd, yyyy")}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Currency:</span>
                    <span>{selectedInvoice.currency}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Status:</span>
                    <Badge
                      className={getStatusBadgeColor(selectedInvoice.status)}
                    >
                      {selectedInvoice.status.charAt(0).toUpperCase() +
                        selectedInvoice.status.slice(1)}
                    </Badge>
                  </div>
                  {selectedInvoice.isRecurring && (
                    <div className="flex justify-between">
                      <span className="font-medium">Recurring:</span>
                      <Badge variant="outline">
                        <Repeat className="h-3 w-3 mr-1" />
                        {selectedInvoice.recurringFrequency}
                      </Badge>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[300px]">Description</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Rate</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedInvoice.items.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.description}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>${item.rate.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      {formatAmount(item.amount, selectedInvoice.currency)}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            <div className="flex justify-end space-x-4 text-right">
              <div className="space-y-1">
                <p className="text-sm">Subtotal:</p>
                <p className="text-sm">Tax ({selectedInvoice.taxRate}%):</p>
                <p className="text-base font-medium">Total:</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm">
                  {formatAmount(
                    selectedInvoice.amount,
                    selectedInvoice.currency,
                  )}
                </p>
                <p className="text-sm">
                  {formatAmount(
                    selectedInvoice.amount * (selectedInvoice.taxRate / 100),
                    selectedInvoice.currency,
                  )}
                </p>
                <p className="text-base font-medium">
                  {formatAmount(
                    selectedInvoice.amount *
                      (1 + selectedInvoice.taxRate / 100),
                    selectedInvoice.currency,
                  )}
                </p>
              </div>
            </div>

            <DialogFooter>
              <div className="flex space-x-2">
                <Button variant="outline">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline">
                  <Send className="mr-2 h-4 w-4" />
                  Send
                </Button>
                <Button>
                  <Download className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default InvoiceSection;
