import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import {
  ArrowUpIcon,
  ArrowDownIcon,
  DollarSignIcon,
  CreditCardIcon,
  BarChart3Icon,
  CalendarIcon,
  ChevronDownIcon,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";

interface SummaryCardProps {
  title: string;
  amount: number;
  percentageChange: number;
  icon: React.ReactNode;
  trendData?: number[];
}

const SummaryCard = ({
  title = "Card Title",
  amount = 0,
  percentageChange = 0,
  icon = <DollarSignIcon />,
  trendData = [5, 10, 15, 8, 12, 18, 15],
}: SummaryCardProps) => {
  const isPositive = percentageChange >= 0;

  return (
    <Card className="bg-white shadow-sm">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <h3 className="text-2xl font-bold mt-1">
              $
              {amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </h3>
            <div className="flex items-center mt-2">
              <span
                className={`flex items-center text-xs font-medium ${isPositive ? "text-green-600" : "text-red-600"}`}
              >
                {isPositive ? (
                  <ArrowUpIcon className="h-3 w-3 mr-1" />
                ) : (
                  <ArrowDownIcon className="h-3 w-3 mr-1" />
                )}
                {Math.abs(percentageChange)}%
              </span>
              <span className="text-xs text-muted-foreground ml-1">
                from last month
              </span>
            </div>
          </div>
          <div className="p-2 rounded-full bg-primary/10">{icon}</div>
        </div>
        <div className="mt-4 h-10">
          {/* Simple trend visualization */}
          <div className="flex items-end justify-between h-full">
            {trendData.map((value, index) => (
              <div
                key={index}
                className={`w-1 rounded-t ${isPositive ? "bg-green-500" : "bg-red-500"}`}
                style={{ height: `${(value / Math.max(...trendData)) * 100}%` }}
              />
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface SummaryCardsProps {
  totalIncome?: number;
  totalExpenses?: number;
  profitLoss?: number;
  incomeChange?: number;
  expensesChange?: number;
  profitLossChange?: number;
}

const SummaryCards = ({
  totalIncome = 12500.75,
  totalExpenses = 4320.5,
  profitLoss = totalIncome - totalExpenses,
  incomeChange = 12.5,
  expensesChange = 8.2,
  profitLossChange = 15.3,
}: SummaryCardsProps) => {
  const [timeFilter, setTimeFilter] = useState("monthly");
  const [customDateRange, setCustomDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({ from: undefined, to: undefined });
  const [isCustomDateOpen, setIsCustomDateOpen] = useState(false);
  const getFilteredData = () => {
    // Mock data filtering based on time period
    const multipliers = {
      daily: 0.1,
      weekly: 0.3,
      monthly: 1,
      yearly: 12,
      custom: 0.8,
    };

    const multiplier = multipliers[timeFilter as keyof typeof multipliers] || 1;

    return {
      income: totalIncome * multiplier,
      expenses: totalExpenses * multiplier,
      profit: (totalIncome - totalExpenses) * multiplier,
    };
  };

  const filteredData = getFilteredData();

  return (
    <div className="w-full bg-background p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Financial Overview</h2>
        <div className="flex items-center space-x-2">
          <Select value={timeFilter} onValueChange={setTimeFilter}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
              <SelectItem value="custom">Custom</SelectItem>
            </SelectContent>
          </Select>
          {timeFilter === "custom" && (
            <Popover open={isCustomDateOpen} onOpenChange={setIsCustomDateOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-48 justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {customDateRange.from ? (
                    customDateRange.to ? (
                      <>
                        {format(customDateRange.from, "LLL dd, y")} -{" "}
                        {format(customDateRange.to, "LLL dd, y")}
                      </>
                    ) : (
                      format(customDateRange.from, "LLL dd, y")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={customDateRange.from}
                  selected={customDateRange}
                  onSelect={setCustomDateRange}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <SummaryCard
          title="Total Income"
          amount={filteredData.income}
          percentageChange={incomeChange}
          icon={<DollarSignIcon className="h-5 w-5 text-green-600" />}
          trendData={[5, 8, 12, 14, 16, 18, 20]}
        />
        <SummaryCard
          title="Total Expenses"
          amount={filteredData.expenses}
          percentageChange={-expensesChange}
          icon={<CreditCardIcon className="h-5 w-5 text-red-600" />}
          trendData={[8, 10, 9, 11, 10, 12, 14]}
        />
        <SummaryCard
          title="Profit/Loss"
          amount={filteredData.profit}
          percentageChange={profitLossChange}
          icon={<BarChart3Icon className="h-5 w-5 text-blue-600" />}
          trendData={[4, 6, 8, 10, 12, 14, 16]}
        />
      </div>
    </div>
  );
};

export default SummaryCards;
