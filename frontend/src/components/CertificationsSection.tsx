'use client';

import { motion } from 'framer-motion';
import { ExternalLink, Award } from 'lucide-react';

const certifications = [
  {
    title: "AWS Certified Developer – Associate",
    issuer: "Amazon Web Services",
    date: "2023",
    badge: "☁️",
    color: "from-orange-400 to-yellow-500",
    credentialId: "AWS-DEV-2023-001",
    url: "#",
    skills: ["EC2", "Lambda", "S3", "DynamoDB"],
  },
  {
    title: "Meta Full-Stack Engineer Professional Certificate",
    issuer: "Meta (Coursera)",
    date: "2022",
    badge: "🔷",
    color: "from-blue-500 to-indigo-600",
    credentialId: "META-FSE-2022",
    url: "#",
    skills: ["React", "Django", "REST APIs", "MySQL"],
  },
  {
    title: "Google Data Analytics Professional Certificate",
    issuer: "Google (Coursera)",
    date: "2022",
    badge: "📊",
    color: "from-green-500 to-emerald-600",
    credentialId: "GOOGLE-DA-2022",
    url: "#",
    skills: ["Python", "SQL", "Tableau", "R"],
  },
  {
    title: "TypeScript: The Complete Developer's Guide",
    issuer: "Udemy (Stephen Grider)",
    date: "2021",
    badge: "⚡",
    color: "from-sky-500 to-blue-600",
    credentialId: "UC-TYPESCRIPT-2021",
    url: "#",
    skills: ["TypeScript", "Generics", "Decorators"],
  },
  {
    title: "Docker & Kubernetes: The Complete Guide",
    issuer: "Udemy (Stephen Grider)",
    date: "2023",
    badge: "🐳",
    color: "from-blue-600 to-cyan-600",
    credentialId: "UC-DOCKER-2023",
    url: "#",
    skills: ["Docker", "Kubernetes", "CI/CD", "Helm"],
  },
  {
    title: "NestJS Zero to Hero",
    issuer: "Udemy (Ariel Weinberger)",
    date: "2022",
    badge: "🦅",
    color: "from-red-500 to-rose-600",
    credentialId: "UC-NEST-2022",
    url: "#",
    skills: ["NestJS", "TypeORM", "JWT", "Guards"],
  },
];

export default function CertificationsSection() {
  return (
    <section id="certifications" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Credentials</span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">Certifications</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Industry-recognized credentials that validate expertise across full-stack development, cloud computing, and data analytics.
          </p>
        </div>

        {/* Certification Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.07 }}
              className="group relative bg-white border border-slate-100 rounded-[28px] p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden"
            >
              {/* Gradient Accent */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${cert.color} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

              {/* Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cert.color} flex items-center justify-center text-2xl shadow-md`}>
                  {cert.badge}
                </div>
                <a href={cert.url} target="_blank" rel="noreferrer" className="p-2 text-slate-300 hover:text-primary transition-colors">
                  <ExternalLink size={16} />
                </a>
              </div>

              {/* Title & Issuer */}
              <h3 className="font-bold text-slate-900 mb-1 leading-snug">{cert.title}</h3>
              <div className="flex items-center gap-2 mb-4">
                <Award size={12} className="text-primary" />
                <span className="text-sm font-medium text-primary">{cert.issuer}</span>
                <span className="text-slate-300 text-xs">• {cert.date}</span>
              </div>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {cert.skills.map((skill) => (
                  <span key={skill} className="px-2 py-0.5 bg-slate-50 text-slate-500 text-[10px] font-bold rounded-md uppercase tracking-wider border border-slate-100">
                    {skill}
                  </span>
                ))}
              </div>

              {/* Credential ID */}
              <p className="text-[10px] font-mono text-slate-300 mt-auto">ID: {cert.credentialId}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
