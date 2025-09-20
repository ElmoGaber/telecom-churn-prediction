"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Brain, TrendingUp, Users, AlertTriangle, CheckCircle } from "lucide-react"

const modelPerformance = [
  { name: "Random Forest", accuracy: 87.2, precision: 85.1, recall: 89.3, f1: 87.1 },
  { name: "Gradient Boosting", accuracy: 89.5, precision: 88.7, recall: 90.2, f1: 89.4 },
  { name: "SVM", accuracy: 84.3, precision: 82.9, recall: 85.7, f1: 84.3 },
  { name: "Logistic Regression", accuracy: 82.1, precision: 80.5, recall: 83.8, f1: 82.1 },
  { name: "Neural Network", accuracy: 88.9, precision: 87.3, recall: 90.5, f1: 88.8 },
]

const churnDistribution = [
  { name: "Retained", value: 73.5, color: "var(--chart-1)" },
  { name: "Churned", value: 26.5, color: "var(--chart-5)" },
]

export default function TelecomChurnPrediction() {
  const [customerData, setCustomerData] = useState({
    tenure: "",
    monthlyCharges: "",
    totalCharges: "",
    contract: "",
    paymentMethod: "",
    internetService: "",
    techSupport: "",
    onlineSecurity: "",
  })

  const [prediction, setPrediction] = useState<{ churnProbability: number; riskLevel: string } | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (field: string, value: string) => {
    setCustomerData((prev) => ({ ...prev, [field]: value }))
  }

  const handlePredict = async () => {
    setIsLoading(true)
    // Simulate ML prediction
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Mock prediction based on input values
    const tenure = Number.parseInt(customerData.tenure) || 0
    const monthlyCharges = Number.parseFloat(customerData.monthlyCharges) || 0

    let churnProb = 0.3
    if (tenure < 12) churnProb += 0.2
    if (monthlyCharges > 80) churnProb += 0.15
    if (customerData.contract === "Month-to-month") churnProb += 0.25
    if (customerData.techSupport === "No") churnProb += 0.1

    churnProb = Math.min(churnProb, 0.95)

    const riskLevel = churnProb > 0.7 ? "High" : churnProb > 0.4 ? "Medium" : "Low"

    setPrediction({ churnProbability: churnProb * 100, riskLevel })
    setIsLoading(false)
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "High":
        return "bg-destructive text-destructive-foreground"
      case "Medium":
        return "bg-secondary text-secondary-foreground"
      case "Low":
        return "bg-primary text-primary-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-primary" />
            <div>
              <h1 className="text-3xl font-bold text-foreground">Telecom Churn Prediction</h1>
              <p className="text-muted-foreground">AI-powered customer retention analytics</p>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="predict" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="predict">Predict Churn</TabsTrigger>
            <TabsTrigger value="models">Model Performance</TabsTrigger>
            <TabsTrigger value="insights">Data Insights</TabsTrigger>
          </TabsList>

          <TabsContent value="predict" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              {/* Input Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Customer Information
                  </CardTitle>
                  <CardDescription>Enter customer details to predict churn probability</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="tenure">Tenure (months)</Label>
                      <Input
                        id="tenure"
                        type="number"
                        placeholder="24"
                        value={customerData.tenure}
                        onChange={(e) => handleInputChange("tenure", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="monthlyCharges">Monthly Charges ($)</Label>
                      <Input
                        id="monthlyCharges"
                        type="number"
                        placeholder="79.99"
                        value={customerData.monthlyCharges}
                        onChange={(e) => handleInputChange("monthlyCharges", e.target.value)}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contract">Contract Type</Label>
                    <Select onValueChange={(value) => handleInputChange("contract", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select contract type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Month-to-month">Month-to-month</SelectItem>
                        <SelectItem value="One year">One year</SelectItem>
                        <SelectItem value="Two year">Two year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="internetService">Internet Service</Label>
                    <Select onValueChange={(value) => handleInputChange("internetService", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select internet service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DSL">DSL</SelectItem>
                        <SelectItem value="Fiber optic">Fiber optic</SelectItem>
                        <SelectItem value="No">No internet service</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="techSupport">Tech Support</Label>
                    <Select onValueChange={(value) => handleInputChange("techSupport", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Has tech support?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Yes">Yes</SelectItem>
                        <SelectItem value="No">No</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handlePredict} className="w-full" disabled={isLoading}>
                    {isLoading ? "Analyzing..." : "Predict Churn Risk"}
                  </Button>
                </CardContent>
              </Card>

              {/* Prediction Results */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Prediction Results
                  </CardTitle>
                  <CardDescription>AI-powered churn risk assessment</CardDescription>
                </CardHeader>
                <CardContent>
                  {prediction ? (
                    <div className="space-y-6">
                      <div className="text-center">
                        <div className="text-4xl font-bold text-foreground mb-2">
                          {prediction.churnProbability.toFixed(1)}%
                        </div>
                        <p className="text-muted-foreground">Churn Probability</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Risk Level</span>
                          <Badge className={getRiskColor(prediction.riskLevel)}>{prediction.riskLevel} Risk</Badge>
                        </div>
                        <Progress value={prediction.churnProbability} className="h-3" />
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-semibold flex items-center gap-2">
                          {prediction.riskLevel === "High" ? (
                            <AlertTriangle className="h-4 w-4 text-destructive" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-primary" />
                          )}
                          Recommendations
                        </h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {prediction.riskLevel === "High" ? (
                            <>
                              <li>• Immediate retention campaign</li>
                              <li>• Offer service upgrades or discounts</li>
                              <li>• Schedule customer success call</li>
                            </>
                          ) : prediction.riskLevel === "Medium" ? (
                            <>
                              <li>• Monitor customer satisfaction</li>
                              <li>• Proactive customer engagement</li>
                              <li>• Consider loyalty program enrollment</li>
                            </>
                          ) : (
                            <>
                              <li>• Customer is likely to stay</li>
                              <li>• Focus on upselling opportunities</li>
                              <li>• Maintain current service quality</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <Brain className="h-12 w-12 mx-auto mb-4 opacity-50" />
                      <p>Enter customer information and click "Predict Churn Risk" to see results</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="models" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Model Performance Comparison</CardTitle>
                <CardDescription>Accuracy metrics for different ML algorithms</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    accuracy: { label: "Accuracy", color: "var(--chart-1)" },
                    precision: { label: "Precision", color: "var(--chart-2)" },
                    recall: { label: "Recall", color: "var(--chart-3)" },
                    f1: { label: "F1 Score", color: "var(--chart-4)" },
                  }}
                  className="h-[400px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={modelPerformance}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="accuracy" fill="var(--chart-1)" />
                      <Bar dataKey="precision" fill="var(--chart-2)" />
                      <Bar dataKey="recall" fill="var(--chart-3)" />
                      <Bar dataKey="f1" fill="var(--chart-4)" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              {modelPerformance.map((model) => (
                <Card key={model.name}>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{model.name}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Accuracy</span>
                        <span className="font-semibold">{model.accuracy}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">F1 Score</span>
                        <span className="font-semibold">{model.f1}%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="insights" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Customer Churn Distribution</CardTitle>
                  <CardDescription>Overall churn rate in the dataset</CardDescription>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={{
                      retained: { label: "Retained", color: "var(--chart-1)" },
                      churned: { label: "Churned", color: "var(--chart-5)" },
                    }}
                    className="h-[300px]"
                  >
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={churnDistribution}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={100}
                          paddingAngle={5}
                          dataKey="value"
                        >
                          {churnDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <ChartTooltip content={<ChartTooltipContent />} />
                      </PieChart>
                    </ResponsiveContainer>
                  </ChartContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Key Insights</CardTitle>
                  <CardDescription>Important findings from the analysis</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-destructive mt-0.5" />
                      <div>
                        <p className="font-semibold">High-Risk Factors</p>
                        <p className="text-sm text-muted-foreground">
                          Month-to-month contracts show 42% higher churn rate
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <TrendingUp className="h-5 w-5 text-primary mt-0.5" />
                      <div>
                        <p className="font-semibold">Retention Drivers</p>
                        <p className="text-sm text-muted-foreground">Tech support reduces churn probability by 35%</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Users className="h-5 w-5 text-secondary mt-0.5" />
                      <div>
                        <p className="font-semibold">Customer Segments</p>
                        <p className="text-sm text-muted-foreground">
                          New customers (&lt; 6 months) have highest churn risk
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
