import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { useToast } from '@/components/ui/use-toast';
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Package,
  Plane,
  User,
  UserPlus,
  ChevronsRight,
  Clock,
  Zap
} from "lucide-react";

interface FormData {
  departCountry: string;
  destinationCountry: string;
  sender: {
    fullName: string;
    city: string;
    address: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  receiver: {
    fullName: string;
    city: string;
    address: string;
    zipCode: string;
    phone: string;
    email: string;
  };
  shippingType: string;
  userNumber: string;
}

const countries = [
  { code: 'DZ', name: 'Algeria' },
  { code: 'RU', name: 'Russia' },
  { code: 'FR', name: 'France' },
  { code: 'CA', name: 'Canada' },
];

const shippingTypes = [
  { code: 'E', name: 'Economic', icon: Clock, description: 'Cost-effective shipping option' },
  { code: 'S', name: 'Standard', icon: Package, description: 'Regular delivery service' },
  { code: 'P', name: 'Express', icon: Zap, description: 'Fastest delivery option' },
];

const ShippingForm = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    departCountry: '',
    destinationCountry: '',
    sender: {
      fullName: '',
      city: '',
      address: '',
      zipCode: '',
      phone: '',
      email: '',
    },
    receiver: {
      fullName: '',
      city: '',
      address: '',
      zipCode: '',
      phone: '',
      email: '',
    },
    shippingType: '',
    userNumber: '',
  });
  const [generatedCodes, setGeneratedCodes] = useState<
    { barcode: string; qrCode: string }[]
  >([]);
  const [sequenceNumber, setSequenceNumber] = useState(1);
  const componentRef = useRef<HTMLDivElement>(null);

  const generateBarcode = () => {
    if (!formData.userNumber) {
      toast({
        title: "Error",
        description: "User Number is required.",
        variant: "destructive",
      });
      return;
    }

    const date = new Date();
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    const sequence = String(sequenceNumber).padStart(2, '0');
    
    const barcode = `${formData.departCountry}${formData.destinationCountry}${day}${month}${year}${String(formData.userNumber).padStart(2, '0')}${sequence}${formData.shippingType}`;
    const qrCode = `${barcode}-QR`;

    setGeneratedCodes(prevCodes => [{ barcode, qrCode }, ...prevCodes]);
    setSequenceNumber(prevSequence => prevSequence + 1);
    
    toast({
      title: "Codes Generated",
      description: `Tracking number: ${barcode}, QR Code: ${qrCode}`,
    });
  };

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      generateBarcode();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const printBarcode = (barcode: string) => {
    const printWindow = window.open('', '', 'height=400,width=800');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Print Barcode</title></head><body><img src="https://barcode.tec-it.com/barcode.ashx?data=${barcode}" alt="Barcode"/><p>${barcode}</p></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printQrCode = (qrCode: string) => {
    const printWindow = window.open('', '', 'height=400,width=400');
    if (printWindow) {
      printWindow.document.write(`<html><head><title>Print QR Code</title></head><body><img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCode)}" alt="QR Code"/><p>${qrCode}</p></body></html>`);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const printReceipt = () => {
    if (componentRef.current) {
      const printWindow = window.open('', '', 'height=600,width=800');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Receipt</title>
              <style>
                body { font-family: sans-serif; }
                .receipt-container { width: 80%; margin: auto; padding: 20px; border: 1px solid #ccc; }
                .code-section { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
                .info-section { margin-top: 20px; }
                .info-section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
              </style>
            </head>
            <body>
              <div class="receipt-container">
                ${componentRef.current.innerHTML}
              </div>
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white py-12 px-4" ref={componentRef}>
      <div className="max-w-4xl mx-auto">
        <Card className="glass-card">
          <CardContent className="p-8">
            {/* Progress Steps */}
            <div className="mb-12">
              <div className="flex items-center justify-between mb-2">
                {[1, 2, 3, 4].map((step) => (
                  <React.Fragment key={step}>
                    <motion.div
                      className={`progress-step ${
                        step <= currentStep ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'
                      }`}
                      animate={{
                        scale: step === currentStep ? 1.1 : 1,
                      }}
                    >
                      {step}
                    </motion.div>
                    {step < 4 && (
                      <div
                        className={`progress-line ${
                          step < currentStep ? 'bg-primary' : 'bg-gray-100'
                        }`}
                      />
                    )}
                  </React.Fragment>
                ))}
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Countries</span>
                <span>Sender</span>
                <span>Receiver</span>
                <span>Shipping</span>
              </div>
            </div>

            {/* Step Content */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <Label>Departure Country</Label>
                    <select
                      className="form-input mt-2"
                      value={formData.departCountry}
                      onChange={(e) =>
                        setFormData({ ...formData, departCountry: e.target.value })
                      }
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <Label>Destination Country</Label>
                    <select
                      className="form-input mt-2"
                      value={formData.destinationCountry}
                      onChange={(e) =>
                        setFormData({ ...formData, destinationCountry: e.target.value })
                      }
                    >
                      <option value="">Select country</option>
                      {countries.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        className="mt-2"
                        value={formData.sender.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sender: { ...formData.sender, fullName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        className="mt-2"
                        value={formData.sender.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sender: { ...formData.sender, city: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Address</Label>
                      <Input
                        className="mt-2"
                        value={formData.sender.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sender: { ...formData.sender, address: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        className="mt-2"
                        value={formData.sender.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            sender: { ...formData.sender, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        className="mt-2"
                        value={formData.receiver.fullName}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            receiver: { ...formData.receiver, fullName: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>City</Label>
                      <Input
                        className="mt-2"
                        value={formData.receiver.city}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            receiver: { ...formData.receiver, city: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label>Address</Label>
                      <Input
                        className="mt-2"
                        value={formData.receiver.address}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            receiver: { ...formData.receiver, address: e.target.value },
                          })
                        }
                      />
                    </div>
                    <div>
                      <Label>Phone</Label>
                      <Input
                        className="mt-2"
                        value={formData.receiver.phone}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            receiver: { ...formData.receiver, phone: e.target.value },
                          })
                        }
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 4 && (
                <div>
                  <div className="grid md:grid-cols-3 gap-6 mb-8">
                    {shippingTypes.map((type) => (
                      <div
                        key={type.code}
                        className={`shipping-card ${
                          formData.shippingType === type.code
                            ? 'border-primary'
                            : 'border-gray-200'
                        }`}
                        onClick={() =>
                          setFormData({ ...formData, shippingType: type.code })
                        }
                      >
                        <div className="flex items-center space-x-3 mb-2">
                          <type.icon className="w-5 h-5 text-primary" />
                          <span className="font-medium">{type.name}</span>
                        </div>
                        <p className="text-sm text-gray-600">{type.description}</p>
                      </div>
                    ))}
                  </div>
                  <div>
                    <Label>User Number</Label>
                    <Input
                      className="mt-2"
                      value={formData.userNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, userNumber: e.target.value })
                      }
                      placeholder="Enter your user number"
                    />
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                >
                  Back
                </Button>
                <Button onClick={handleNext} disabled={currentStep === 4 && !formData.userNumber}>
                  {currentStep === 4 ? 'Generate Codes' : 'Next'}
                </Button>
              </div>

              {/* Generated Barcode Display */}
              {generatedCodes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 p-6 border rounded-xl"
                >
                  <h3 className="text-lg font-medium mb-4 text-center">Generated Codes</h3>
                  <ul className="space-y-4">
                    {generatedCodes.map(({ barcode, qrCode }, index) => (
                      <li key={index} className="border rounded-md p-4">
                        <div className="flex flex-col items-center">
                          <div className="flex justify-between w-full">
                            <div>
                              <p className="text-sm font-medium">Barcode:</p>
                              <p className="text-2xl font-mono">{barcode}</p>
                              <img
                                src={`https://barcode.tec-it.com/barcode.ashx?data=${barcode}`}
                                alt={`Barcode ${index + 1}`}
                                className="mt-4"
                              />
                              
                            </div>
                            <div>
                              <p className="text-sm font-medium">QR Code:</p>
                              <p className="text-2xl font-mono">{qrCode}</p>
                              <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrCode)}`}
                                alt={`QR Code ${index + 1}`}
                                className="mt-4"
                              />
                            </div>
                          </div>
                          <div className="flex justify-center space-x-2 mt-4 w-full">
                            <Button onClick={() => printBarcode(barcode)}>Print Barcode</Button>
                            <Button onClick={() => printQrCode(qrCode)}>Print QR Code</Button>
                          </div>
                          <Button className="mt-4 w-full" onClick={printReceipt}>Print Receipt</Button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ShippingForm;
