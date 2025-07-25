
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

export default function Footer() {
  const logoSrc = "/lovable-uploads/1649c4bf-c03b-4d41-b660-4a2d8eded619.png";

  return (
    <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-black border-t border-white/20">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={logoSrc}
                alt="Axions Laboratory Logo"
                className="h-12 w-auto drop-shadow-sm"
              />
              <Badge variant="outline" className="text-xs bg-black border-white/30 text-white">
                AGI Research Lab
              </Badge>
            </div>
            <p className="text-white/60 mb-4 max-w-md">
              Pioneering the future of artificial general intelligence and advanced AI technologies 
              that will revolutionize how humans interact with intelligent systems.
            </p>
            <div className="flex flex-wrap gap-2">
              <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">Artificial Intelligence</Badge>
              <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">Voice AI</Badge>
              <Badge variant="secondary" className="text-xs bg-white/10 text-white border-white/20">AGI Research</Badge>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Research Areas</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Artificial General Intelligence</li>
              <li>Voice Intelligence Systems</li>
              <li>Large Language Models</li>
              <li>Real-time AI Interaction</li>
              <li>AI Security & Privacy</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-semibold mb-4 text-white">Products</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>Gideon Platform <Badge variant="outline" className="ml-1 text-xs bg-black border-white/30 text-white">Coming Soon</Badge></li>
              <li>Echelon Models</li>
              <li>Voice AI SDK</li>
              <li>Developer Resources</li>
            </ul>
          </div>
        </div>
        
        <Separator className="mb-8 bg-white/20" />
        
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex space-x-6">
            {[
              { name: "Twitter", icon: "M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5 0-.28-.03-.56-.08-.83A7.72 7.72 0 0 0 23 3z" },
              { name: "LinkedIn", icon: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" },
              { name: "GitHub", icon: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" }
            ].map((item) => (
              <a
                key={item.name}
                href="#"
                className="text-white/60 hover:text-white transition-colors"
                aria-label={item.name}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={item.icon}></path>
                </svg>
              </a>
            ))}
          </div>
          
          <div className="text-sm text-white/60">
            © 2025 AxionsLab. All rights reserved. | Advancing AI frontiers since 2025.
          </div>
        </div>
      </div>
    </footer>
  );
}
