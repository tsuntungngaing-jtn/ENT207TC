import { knowledgeArticles } from '../data/mock'
import { TopBar } from '../components/layout/TopBar'
import { Page, Panel, SectionTitle } from '../components/ui/Primitives'

export function KnowledgePage() {
  return (
    <>
      <TopBar
        title="Knowledge Base"
        subtitle="Industry playbooks grounding Research & Strategy agents"
      />
      <Page>
        <div className="mx-auto max-w-7xl animate-fade-up">
          <Panel>
            <SectionTitle
              title="Operational knowledge"
              subtitle="Curated guidance for weak-season hospitality decisions"
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {knowledgeArticles.map((a) => (
                <article
                  key={a.title}
                  className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5 transition hover:border-teal-200 hover:bg-teal-50/30"
                >
                  <span className="rounded-full bg-navy-900 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-teal-300">
                    {a.tag}
                  </span>
                  <h3 className="mt-3 text-base font-bold text-navy-900">{a.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">{a.summary}</p>
                </article>
              ))}
            </div>
          </Panel>
        </div>
      </Page>
    </>
  )
}
