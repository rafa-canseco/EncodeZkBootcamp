import React, { useState } from 'react';
import { generateProof, verify } from '../services/zokratesServices';
import type { Proof, SetupKeypair } from "zokrates-js";
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'

const ZeroKnowledgeProofs: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const [proofResult, setProofResult] = useState<string>('');
  const [verificationResult, setVerificationResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const result = await generateProof(inputValue);
      if (!result || !result.keypair || !('vk' in result.keypair) || !('pk' in result.keypair)) {
        throw new Error("The result does not have the expected structure with 'proof' and 'keypair'.");
      }
      const { proof, keypair } = result as { proof: Proof, keypair: SetupKeypair };
      
      console.log('Keypair:', keypair);
      setProofResult(JSON.stringify(proof, null, 2));

      const isVerified = await verify(keypair.vk, proof, proof.inputs);
      setVerificationResult(isVerified ? "Verification successful" : "Verification failed");
    } catch (error) {
      console.error("Error:", error);
      setProofResult("Error generating proof");
      setVerificationResult("Verification error");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">ZeroKnowledge Proofs</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a value"
          className="border p-2 mr-2"
        />
        <Button type="submit" className="bg-blue-500 text-white p-2 rounded" disabled={isLoading}>
          {isLoading ? 'Generating...' : 'Generate Proof'}
        </Button>
      </form>
      {isLoading && <p className="text-blue-500">Loading...</p>}
      <div>
        <h2 className="text-xl font-semibold mb-2">Proof Result:</h2>
        <pre className="bg-gray-100 p-2 rounded">{proofResult}</pre>
      </div>
      <div className="mt-4">
        <h2 className="text-xl font-semibold mb-2">Verification Result:</h2>
        <p className="bg-gray-100 p-2 rounded">{verificationResult}</p>
      </div>
    </div>
  );
};

export default ZeroKnowledgeProofs;