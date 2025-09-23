  };
};,
oadQuestionste,
    l  setStatate,
    snfig,
  {
    co
  return tions]);
DynamicQuesouldLoadshonfig,  }, [c
 ;
    }))e }falsstions: QuedingLoa...prev, is ({ (prev =>State   set
    } finally {}
   r);
      backErrons:', fallk questiollbacloading far ('Erroe.error     consol  
 kError) {allbac} catch (f
      ));uestions }: fallbackQQuestionsrev, dynamic{ ...pprev => (tate(     setS;
         }))  }`
  e.now()ndex}_${Datk_${iid: `fallbac _
           ..q,       .({
     > (q, index) =   .map(      ount)
 ionCuest0, config.q    .slice(s
      ionQuestionallRealAviatuestions = ckQconst fallba    ;
    nQuestions')Aviatioa/real/datrt('@mpo } = await iuestionsealAviationQt { allR        cons   try {
stions
   lback quevide fal  // Pro  
      }));
  s Error  error aor:ionsErrev, quest> ({ ...prv =ate(pretStse {
      atch (error) c }
   ));
      }ons }stielaxedQueuestions: r dynamicQrev,v => ({ ...pState(pre   set
         );  
  ountonCfig.questi con         'all',
         'ALL',
           all',
egory || ' config.cat       de,
  g.monfi       coons(
   tiuesrQadAndFilte = await loonsxedQuesti const rela      c
  logilback   // Fal   {
   else );
      }uestions })ons: loadedQnamicQuesti.prev, dy ({ ..rev =>e(p setStat     
  th > 0) {stions.lengoadedQue&& ldQuestions  (loade  if  
      
  
      });g.examTitleonfiitle: c examT      t,
 stionCoun config.quetionCount:ques,
        lty.difficu configty:icul        diffaircraft,
config.craft:       air
  gory,catey: config.  categore,
      : config.mod    mode  ons({
  Questioadoader.lnLuestiozedQit Optimitions = awaQuesedoad     const l {
  try 
   ));
    null }ionsError:uest true, qQuestions:, isLoading ...prevev => ({e(prat
    setSt
    }
   return;   
ode)) {.my, configtegor.caamId, config(exstionsueicQnamdDy!shouldLoa {
    if () =>tring | null smId:nc (exalback(asyCaltions = useQuesadlo const 
 ]);
;
  }, [nscQuestioamiuiresDyn && reqalExamIdn hasNoRe retur   ;
    
=== 'review'e  modtimed' ||== 'ry || mode = = categocQuestionsiresDynamionst requ;
    cIdryExamempora isT!examId ||mId = RealExaonst hasNo    cp_exam_');
temtartsWith('xamId.sId && eamId = examExrary isTempo  const) => {
  ringng, mode: stry: stri, catego| nullring ((examId: st useCallbackuestions =amicQDyn shouldLoad

  const
  });on: false,xplanatiwE sho  
 d: false,wereisAnsl,
    nuledAnswer:     selections: [],
Questic   dynamll,
 : nunsError   questio
 lse,uestions: fagQ    isLoadintate>({
amModeSExte<e] = useSta, setStatst [state;

  conParams])search };
  }, [,
   examTitle
      || '0'),') imeLimit.get('trchParamseInt(seaparsimit:  timeL0'),
     ount') || '2'questionCet(Params.g(searcheIntrsionCount: pa    quest,
   ''lty') ||difficuarams.get('chPearficulty: s
      difFAMILY', 'A320_aft') ||cr('airhParams.getft: searc   aircra
   dCategory,ecte: selegory,
      catdeode: examMo   m  urn {
 ret
      }
    
  romTitle;tegoryFtle] || caoryFromTi[categMap= categoryry edCatego     select
      };
 lics',ydrauulico': 'hema-hidrá  'sist',
      ectrical 'elo':rictema-eléct        'sisce',
performan': 'performance
        '',aulicsydrraulics': 'h        'hydics',
c': 'hydraulliau      'hydr',
  ricall': 'electlectrica  'e
      ing } = {ing]: str stry:kegoryMap: { [t cate
      cons '-');(/\s+/g,eplaceCase().rLower', '').to: cticae('Prá.replac= examTitleyFromTitle onst categor      c ')) {
Práctica:tartsWith('e.s && examTitlategory(!selectedC   if '';
 | ) |.get('title'hParamstle = searct examTinsco
    
        }m;
goriesParay = catedCategor  selecte) {
    esParamif (categori 
    
   '';gories') || et('cateParams.g = searchamgoriesParonst cate
    c '';egory') ||ms.get('cathParasearc = ctedCategoryelet s
    le;
    e': 'practicode rawMiew' ?  === 'revMode|| raw'timed' wMode ===     ra  eview' = 
' | 'r| 'timed 'practice'  examMode:onst;
    c'practice'de') || et('mohParams.gearcrawMode = s  const {
  ig => onf: ExamModeCeMemo(() config = us consteters
 am URL pard validatet an
  // Extracs();
  earchParamuseS] = rchParamsconst [sea{
  = () => seExamMode ort const u
}

expboolean;lanation: 
  showExp boolean;nswered:ll;
  isAr | nunswer: numbeectedAel  s;
on[]ionQuestialAviattions: ReicQuesdynam| null;
  r Error: nsErrostio  que
an;s: boolegQuestionadine {
  isLoStatce ExamModerfa inte}

exportstring;
xamTitle: number;
  etimeLimit: r;
  t: numbeuestionCoun
  qg;ty: strinfficul  di: string;
craft;
  airry: string  catego 'review';
med' |ice' | 'tide: 'practmoig {
  odeConfExamMinterface 

export Loader';zedQuestionices/Optimifrom '@/server } QuestionLoadzed { Optimirtimpo
er';uestionLoadls/qtirom '@/uestions } fdFilterQurt { loadAn
impo';stionsQuerealAviation '@/data/fromon } tinQuesRealAviatiot type { om';
imporr-d'react-routems } from ra useSearchPa {
import'react';back } from seCalleMemo, uect, useEff ususeState,import { 