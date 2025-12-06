import { Package, Download } from 'lucide-react';

interface ProductSpecificationsProps {
  specs: Record<string, string>;
}

export function ProductSpecifications({ specs }: ProductSpecificationsProps) {
  const specCategories = {
    'Performance': ['Processor', 'RAM', 'Graphics', 'Storage'],
    'Display': ['Display'],
    'Connectivity': ['Connectivity', 'Ports'],
    'System': ['Operating System', 'Battery', 'Weight']
  };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <h3>Technical Specifications</h3>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 transition-colors">
          <Download className="w-5 h-5" />
          Download Specs Sheet
        </button>
      </div>

      <div className="space-y-8">
        {Object.entries(specCategories).map(([category, keys]) => (
          <div key={category}>
            <h4 className="mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-purple-600" />
              {category}
            </h4>
            <div className="border border-gray-200 rounded-xl overflow-hidden">
              {keys.map((key, index) => {
                const value = specs[key];
                if (!value) return null;
                return (
                  <div
                    key={key}
                    className={`grid grid-cols-3 p-4 ${
                      index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                    }`}
                  >
                    <div className="col-span-1 text-gray-600">{key}</div>
                    <div className="col-span-2 text-gray-900">{value}</div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 p-6 bg-blue-50 rounded-xl">
        <h4 className="mb-3">Additional Information</h4>
        <ul className="space-y-2 text-gray-700">
          <li>• Energy Star certified</li>
          <li>• RoHS compliant</li>
          <li>• FCC certified</li>
          <li>• Manufactured in certified facilities</li>
          <li>• Includes comprehensive user manual</li>
        </ul>
      </div>
    </div>
  );
}
