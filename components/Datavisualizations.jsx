import { 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  XAxis, 
  YAxis, 
  Tooltip 
} from 'recharts';

export function DataVisualizations({ data }) {
  const COLORS = ['#1e293b', '#475569', '#64748b', '#94a3b8'];

  return (
    <div className="bg-white rounded-2xl p-6 border-2 border-slate-300 shadow-[3px_3px_0px_#cbd5e1]">
      <h2 className="text-lg font-semibold mb-6 text-slate-700">Data Visualizations:</h2>
      
      <div className="grid md:grid-cols-3 gap-8">

        {/* Bar Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-slate-700">
            Bar Chart:<br />
            <span className="font-normal">Quality Metrics</span>
          </h3>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={data.barChart.data}>
                <XAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="value" fill="#1e293b" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <p className="text-xs text-slate-500 mt-2 text-center">Comp Cons Acc Val</p>
        </div>

        {/* Pie Chart */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-slate-700">
            Pie Chart:<br />
            <span className="font-normal">Data Types</span>
          </h3>

          <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-center">
            <ResponsiveContainer width="100%" height={180}>
              <PieChart>
                <Pie
                  data={data.pieChart.data}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  fill="#8884d8"
                  dataKey="count"
                  label
                >
                  {data.pieChart.data.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]} 
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex gap-4 justify-center text-xs mt-2 text-slate-500">
            <span>■ Text</span>
            <span>■ Int</span>
          </div>
        </div>

        {/* Column Issues */}
        <div>
          <h3 className="text-sm font-medium mb-4 text-slate-700">Column Issues:</h3>

          <div className="border-2 border-slate-300 rounded-lg p-4 bg-white shadow-[2px_2px_0px_#cbd5e1]">
            <div className="space-y-2">
              {data.columnIssues.map((col) => (
                <div 
                  key={col.name} 
                  className="flex justify-between text-sm text-slate-700"
                >
                  <span>{col.name}:</span>
                  <span className="font-semibold">{col.count}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
