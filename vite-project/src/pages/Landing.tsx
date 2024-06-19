const Landing = ({ walletAddress }) => {
    return (
      <div>
        <p className="text-lg underline">Bienvenido a Nuestra Página</p>
        {walletAddress ? (
          <p className="mt-4">Dirección de la Wallet: {walletAddress}</p>
        ) : (
          <p className="mt-4">Por favor, conecta tu wallet.</p>
        )}
      </div>
    );
  };
  
  export default Landing;