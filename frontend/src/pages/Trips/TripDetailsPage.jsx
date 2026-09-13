import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import tripService from '../../services/tripService.js';

export default function TripDetailsPage() {
  const { tripId } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [heroImage, setHeroImage] = useState('');
  const [heroPhoto, setHeroPhoto] = useState(null);
  const [imageLoading, setImageLoading] = useState(false);

  // Keep all derived trip values inside the component so they are available
  // to the image loader and the page UI. During the first render trip is null.
  const safeTrip = trip || {};
  const destination = getDestination(safeTrip);
  const durationNumber = getDurationNumber(safeTrip);
  const duration = getDuration(safeTrip);
  const travelers = getTravelers(safeTrip);
  const travelStyle = getTravelStyle(safeTrip);
  const budget = getBudget(safeTrip);
  const itinerary = getItinerary(safeTrip);
  const tips = getTips(safeTrip);
  const fallbackImage =
    getTripImage(safeTrip) || getDestinationImage(safeTrip);

  useEffect(() => {
    let active = true;

    async function loadTrip() {
      try {
        setLoading(true);
        setError('');

        if (!tripId) {
          throw new Error('Trip ID is missing.');
        }

        const response = await tripService.getById(tripId);
        const normalizedTrip = normalizeResponse(response);

        if (!normalizedTrip) {
          throw new Error('Trip data was not found.');
        }

        if (active) {
          setTrip(normalizedTrip);
        }
      } catch (err) {
        console.error('Trip details error:', err);

        if (active) {
          setError(
            err?.response?.data?.message ||
              err?.message ||
              'Unable to load this trip.'
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadTrip();

    return () => {
      active = false;
    };
  }, [tripId]);

  useEffect(() => {
    let cancelled = false;

    async function searchUnsplash(apiKey, searchQuery) {
      const url =
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}` +
        '&page=1&per_page=30&orientation=landscape&order_by=relevant&content_filter=high';

      const response = await fetch(url, {
        headers: {
          Authorization: `Client-ID ${apiKey}`,
          'Accept-Version': 'v1'
        }
      });

      if (!response.ok) {
        throw new Error(`Unsplash request failed: ${response.status}`);
      }

      const data = await response.json();
      return Array.isArray(data?.results) ? data.results : [];
    }

    async function loadDestinationImage() {
      if (!trip) {
        setImageLoading(false);
        return;
      }

      setImageLoading(true);

      const apiKey = String(
        import.meta.env.VITE_UNSPLASH_ACCESS_KEY || ''
      ).trim();

      if (!apiKey) {
        if (!cancelled) {
          setHeroImage(fallbackImage);
          setImageLoading(false);
        }
        return;
      }

      // v4 intentionally invalidates all previous low-resolution cached images.
      const cacheKey = `tripmate:hero-image:v4:${tripIdOrTripKey(trip, tripId)}`;
      const cached = readCachedHeroImage(cacheKey);

      if (cached?.url) {
        if (!cancelled) {
          setHeroImage(cached.url);
          setHeroPhoto(cached.photo || null);
          setImageLoading(false);
        }
        return;
      }

      try {
        const queries = buildDestinationImageQueries(trip, destination);
        let results = [];

        for (const query of queries) {
          const current = await searchUnsplash(apiKey, query);
          const large = current.filter(isLargeLandscapePhoto);

          if (large.length >= 5) {
            results = large;
            break;
          }

          if (!results.length && current.length) {
            results = current;
          }
        }

        if (!results.length) {
          throw new Error('No destination images found.');
        }

        // Never deliberately choose a small source photo for the large hero.
        const largeResults = results.filter(isLargeLandscapePhoto);
        const usableResults = largeResults.length
          ? largeResults
          : results.filter(isLandscapePhoto);

        if (!usableResults.length) {
          throw new Error('No usable destination images found.');
        }

        // Rank by actual source resolution. The original Unsplash photo dimensions
        // are supplied in photo.width/photo.height, so this avoids blurry sources.
        const ranked = [...usableResults].sort((a, b) => {
          const aPixels = Number(a?.width || 0) * Number(a?.height || 0);
          const bPixels = Number(b?.width || 0) * Number(b?.height || 0);
          return bPixels - aPixels;
        });

        // Pick among the best 12 so different trips can still receive different photos.
        const topPool = ranked.slice(0, Math.min(12, ranked.length));
        const selected =
          topPool[
            stableImageIndex(
              tripIdOrTripKey(trip, tripId),
              topPool.length
            )
          ];

        const photoUrl = getHighQualityUnsplashUrl(selected);

        if (!photoUrl) {
          throw new Error('Selected image has no usable URL.');
        }

        const photo = {
          id: selected?.id || '',
          photographer:
            selected?.user?.name || 'Unsplash photographer',
          photographerUrl:
            selected?.user?.links?.html || 'https://unsplash.com/',
          unsplashUrl:
            selected?.links?.html || 'https://unsplash.com/',
          width: selected?.width || 0,
          height: selected?.height || 0
        };

        writeCachedHeroImage(cacheKey, {
          url: photoUrl,
          photo
        });

        if (!cancelled) {
          setHeroImage(photoUrl);
          setHeroPhoto(photo);
        }
      } catch (err) {
        console.warn(
          'TripMate destination image search failed:',
          err
        );

        if (!cancelled) {
          setHeroImage(fallbackImage);
        }
      } finally {
        if (!cancelled) {
          setImageLoading(false);
        }
      }
    }

    loadDestinationImage();

    return () => {
      cancelled = true;
    };
  }, [trip, destination, tripId, fallbackImage]);

  if (loading) {
    return <LoadingState />;
  }

  if (error || !trip) {
    return <ErrorState message={error} />;
  }

  const overview =
    text(trip.description) ||
    text(trip.overview) ||
    text(trip.summary) ||
    `A personalized ${duration || ''} journey through ${destination}, created around your selected travel preferences.`;

  const dates = formatDateRange(
    getDate(trip.startDate || trip.start_date || trip.fromDate),
    getDate(trip.endDate || trip.end_date || trip.toDate)
  );

  const budgetItems = getBudgetItems(budget);
  const totalBudget = formatBudget(budget);

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-50 text-slate-950 dark:bg-slate-950 dark:text-white">
      <div className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">

        <Link
          to="/trips"
          className="inline-flex items-center gap-2 rounded-full px-1 py-2 text-sm font-bold text-violet-600 transition hover:text-violet-800 dark:text-violet-400 dark:hover:text-violet-300"
        >
          ← Back to My Trips
        </Link>

        <header className="mt-6">
          <div className="flex flex-wrap gap-2">
            <span className="rounded-full bg-violet-100 px-4 py-2 text-xs font-extrabold text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              ✨ AI Generated Trip
            </span>

            {travelStyle && (
              <span className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
                {travelStyle}
              </span>
            )}
          </div>

          <h1 className="mt-5 max-w-5xl text-4xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            {text(trip.title) ||
              text(trip.name) ||
              `${durationNumber || ''} Days Adventure in ${destination}`}
          </h1>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-500 dark:text-slate-400">
            <span>📍 {destination}</span>
            {duration && <span>📅 {duration}</span>}
            {dates && <span>🗓️ {dates}</span>}
          </div>
        </header>

        {/* HERO */}
        <section className="mt-8">
          <div className="relative overflow-hidden rounded-[30px] border border-slate-200 bg-slate-200 shadow-2xl dark:border-slate-800 dark:bg-slate-900">
            {heroImage ? (
              <img
                src={heroImage}
                alt={`${destination} travel destination`}
                className={`h-[300px] w-full object-cover object-center transition-opacity duration-700 sm:h-[420px] lg:h-[540px] ${
                  imageLoading ? 'opacity-70' : 'opacity-100'
                }`}
                loading="eager"
                decoding="async"
                fetchPriority="high"
                draggable="false"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.classList.remove('hidden');
                }}
              />
            ) : null}

            <div
              className={`${
                heroImage ? 'hidden' : ''
              } flex h-[300px] w-full items-center justify-center bg-gradient-to-br from-violet-700 via-indigo-600 to-sky-600 sm:h-[400px] lg:h-[520px]`}
            >
              <div className="text-center text-white">
                <div className="text-7xl">✈️</div>
                <p className="mt-4 text-3xl font-black capitalize">{destination}</p>
                <p className="mt-2 text-white/75">Your personalized journey</p>
              </div>
            </div>

            {imageLoading && (
              <div className="absolute left-5 top-5 rounded-full border border-white/20 bg-black/30 px-3 py-1.5 text-xs font-bold text-white backdrop-blur-md">
                Finding the best {destination} photo…
              </div>
            )}

            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />

            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">
                    Your personalized journey
                  </p>
                  <h2 className="mt-2 text-4xl font-black capitalize text-white sm:text-5xl">
                    {destination}
                  </h2>
                  {dates && (
                    <p className="mt-2 text-sm text-white/85 sm:text-base">
                      {dates}
                    </p>
                  )}

                  {heroPhoto?.photographer && (
                    <p className="mt-3 text-xs text-white/70">
                      Photo by{' '}
                      <a
                        href={`${heroPhoto.photographerUrl}?utm_source=tripmate&utm_medium=referral`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
                      >
                        {heroPhoto.photographer}
                      </a>{' '}
                      on{' '}
                      <a
                        href={`${heroPhoto.unsplashUrl}?utm_source=tripmate&utm_medium=referral`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-semibold text-white underline decoration-white/40 underline-offset-2 hover:decoration-white"
                      >
                        Unsplash
                      </a>
                    </p>
                  )}
                </div>

                <div className="w-fit rounded-2xl border border-white/20 bg-white/15 px-5 py-4 text-white shadow-lg backdrop-blur-xl">
                  <p className="text-xs text-white/70">Estimated total</p>
                  <p className="mt-1 text-2xl font-black">{totalBudget}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* QUICK STATS */}
        <section className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Stat icon="👥" label="Travelers" value={travelers || 'Not specified'} />
          <Stat icon="⏱️" label="Duration" value={duration || 'Not specified'} />
          <Stat icon="✈️" label="Travel Style" value={travelStyle || 'Not specified'} />
          <Stat icon="💰" label="Total Budget" value={totalBudget} highlight />
        </section>

        {/* OVERVIEW */}
        <section className="mt-12 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <Card>
            <SectionTitle eyebrow="ABOUT YOUR TRIP" title="Trip Overview" />
            <p className="mt-5 text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
              {overview}
            </p>
          </Card>

          <Card>
            <SectionTitle eyebrow="TRIP SNAPSHOT" title="At a Glance" />
            <div className="mt-5 space-y-5">
              <InfoRow icon="📍" label="Destination" value={destination} />
              <InfoRow icon="👥" label="Travelers" value={String(travelers || '—')} />
              <InfoRow icon="📅" label="Duration" value={duration || '—'} />
              <InfoRow icon="✈️" label="Travel style" value={travelStyle || '—'} />
              <InfoRow icon="💰" label="Budget" value={totalBudget} />
              {dates && <InfoRow icon="🗓️" label="Travel dates" value={dates} />}
            </div>
          </Card>
        </section>

        {/* BUDGET */}
        {budgetItems.length > 0 && (
          <section className="mt-12">
            <SectionTitle eyebrow="PLAN YOUR SPENDING" title="Budget Breakdown" />

            <Card className="mt-5 overflow-hidden p-0">
              <div className="p-6 sm:p-8">
                <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Estimated total
                    </p>
                    <p className="mt-1 text-4xl font-black">{totalBudget}</p>
                  </div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Based on your selected preferences
                  </p>
                </div>

                <BudgetBar items={budgetItems} total={Number(budget.total) || 1} />

                <div className="mt-5 divide-y divide-slate-100 dark:divide-slate-800">
                  {budgetItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 py-4"
                    >
                      <span className="font-medium text-slate-600 dark:text-slate-300">
                        {item.label}
                      </span>
                      <span className="font-black">
                        {formatCurrency(item.value, budget.currency)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </section>
        )}

        {/* TIPS */}
        {tips.length > 0 && (
          <section className="mt-12">
            <SectionTitle eyebrow="TRAVEL SMART" title="Travel Tips" />
            <div className="mt-5 grid gap-4 md:grid-cols-2">
              {tips.map((tip, index) => {
                const value = getTipText(tip);
                if (!value) return null;

                return (
                  <div
                    key={`${index}-${value}`}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex gap-4">
                      <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 font-black text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
                        {index + 1}
                      </span>
                      <p className="leading-7 text-slate-600 dark:text-slate-300">
                        {value}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ITINERARY */}
        <section className="mt-12">
          <SectionTitle eyebrow="YOUR PERSONAL PLAN" title="Day-by-Day Itinerary" />
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            Explore your AI-generated plan, organized around every day of your journey.
          </p>

          {itinerary.length === 0 ? (
            <Card className="mt-5">
              <p className="text-slate-500 dark:text-slate-400">
                No itinerary details are available for this trip.
              </p>
            </Card>
          ) : (
            <div className="mt-6 space-y-7">
              {itinerary.map((day, index) => (
                <DayCard key={`day-${index}`} day={day} index={index} />
              ))}
            </div>
          )}
        </section>

        {/* FOOTER CTA */}
        <section className="my-12">
          <div className="rounded-[28px] bg-gradient-to-r from-violet-700 via-indigo-600 to-sky-600 p-7 text-white shadow-xl sm:p-10">
            <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/70">
                  TripMate
                </p>
                <h2 className="mt-2 text-2xl font-black sm:text-3xl">
                  Ready for your journey?
                </h2>
                <p className="mt-2 text-white/75">
                  Your personalized travel plan is ready to explore.
                </p>
              </div>

              <Link
                to="/trips"
                className="inline-flex w-fit items-center rounded-xl bg-white px-6 py-3.5 font-black text-violet-700 transition hover:bg-slate-100"
              >
                ← View My Trips
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

function DayCard({ day, index }) {
  const number = day?.dayNumber || day?.day || index + 1;
  const title =
    text(day?.title) ||
    text(day?.name) ||
    `Day ${number}`;
  const summary =
    text(day?.summary) ||
    text(day?.description);
  const activities = Array.isArray(day?.activities)
    ? day.activities
    : [];

  return (
    <article className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="border-b border-slate-200 p-5 sm:p-7 dark:border-slate-800">
        <div className="flex gap-4 sm:gap-5">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-violet-100 text-lg font-black text-violet-700 dark:bg-violet-950/60 dark:text-violet-300 sm:h-14 sm:w-14">
            {number}
          </div>

          <div className="min-w-0">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-violet-600 dark:text-violet-400">
              Day {number}
            </p>
            <h3 className="mt-1 text-xl font-black sm:text-2xl">
              {title}
            </h3>
            {summary && (
              <p className="mt-2 leading-7 text-slate-500 dark:text-slate-400">
                {summary}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-4 sm:p-7">
        {activities.length === 0 ? (
          <p className="text-slate-500 dark:text-slate-400">
            No activities available for this day.
          </p>
        ) : (
          <div className="relative space-y-5">
            <div className="absolute bottom-5 left-5 top-5 hidden w-px bg-violet-200 dark:bg-violet-900 sm:block" />

            {activities.map((activity, activityIndex) => (
              <ActivityCard
                key={`activity-${activityIndex}`}
                activity={activity}
                index={activityIndex}
              />
            ))}
          </div>
        )}
      </div>
    </article>
  );
}

function ActivityCard({ activity, index }) {
  const name =
    text(activity?.name) ||
    text(activity?.title) ||
    text(activity?.activity) ||
    `Activity ${index + 1}`;

  const time = text(activity?.time);
  const location = getLocation(activity);
  const description =
    text(activity?.description) ||
    text(activity?.notes) ||
    text(activity?.details);

  return (
    <div className="relative sm:pl-10">
      <div className="absolute left-[15px] top-6 hidden h-3 w-3 rounded-full bg-violet-500 ring-4 ring-violet-100 dark:ring-violet-950 sm:block" />

      <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5 transition hover:border-violet-200 hover:shadow-md dark:border-slate-800 dark:bg-slate-800/60 dark:hover:border-violet-900">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-start">
          <h4 className="text-base font-black sm:text-lg">{name}</h4>

          {time && (
            <span className="w-fit shrink-0 rounded-full bg-violet-100 px-3 py-1 text-xs font-black text-violet-700 dark:bg-violet-950/60 dark:text-violet-300">
              {time}
            </span>
          )}
        </div>

        {location && (
          <p className="mt-3 flex gap-2 text-sm text-slate-500 dark:text-slate-400">
            <span className="shrink-0 text-pink-500">📍</span>
            <span className="break-words">{location}</span>
          </p>
        )}

        {description && (
          <p className="mt-3 leading-7 text-slate-600 dark:text-slate-300">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({ icon, label, value, highlight = false }) {
  return (
    <div
      className={`rounded-2xl border p-5 shadow-sm ${
        highlight
          ? 'border-violet-200 bg-violet-50 dark:border-violet-900 dark:bg-violet-950/30'
          : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'
      }`}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-violet-100 text-lg dark:bg-violet-950/60">
          {icon}
        </div>
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          <p className="mt-1 break-words text-lg font-black">{value}</p>
        </div>
      </div>
    </div>
  );
}

function Card({ children, className = '' }) {
  return (
    <div
      className={`rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8 ${className}`}
    >
      {children}
    </div>
  );
}

function SectionTitle({ eyebrow, title }) {
  return (
    <div>
      <p className="text-xs font-black tracking-[0.18em] text-violet-600 dark:text-violet-400">
        {eyebrow}
      </p>
      <h2 className="mt-2 text-2xl font-black tracking-tight sm:text-3xl">
        {title}
      </h2>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex gap-3">
      <span className="text-lg">{icon}</span>
      <div className="min-w-0">
        <p className="text-xs font-bold uppercase tracking-wide text-slate-400 dark:text-slate-500">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-bold text-slate-800 dark:text-slate-200">
          {value}
        </p>
      </div>
    </div>
  );
}

function BudgetBar({ items, total }) {
  const classes = [
    'bg-violet-500',
    'bg-indigo-500',
    'bg-pink-500',
    'bg-sky-500'
  ];

  return (
    <div className="mt-7 flex h-3 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
      {items.map((item, index) => {
        const width = Math.max(
          2,
          Math.min(100, (Number(item.value) / total) * 100)
        );

        return (
          <div
            key={item.label}
            className={`h-full ${classes[index % classes.length]}`}
            style={{ width: `${width}%` }}
          />
        );
      })}
    </div>
  );
}

function LoadingState() {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-10 sm:px-6 lg:px-8">
        <div className="h-5 w-32 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 h-14 max-w-3xl rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="mt-4 h-5 w-72 rounded bg-slate-200 dark:bg-slate-800" />
        <div className="mt-8 h-[320px] rounded-[30px] bg-slate-200 dark:bg-slate-800 sm:h-[500px]" />
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          ))}
        </div>
      </div>
    </main>
  );
}

function ErrorState({ message }) {
  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <Link
          to="/trips"
          className="font-bold text-violet-600 dark:text-violet-400"
        >
          ← My Trips
        </Link>

        <div className="mt-8 rounded-3xl border border-red-200 bg-white p-8 dark:border-red-900 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-xl dark:bg-red-950/50">
            ⚠️
          </div>
          <h1 className="mt-5 text-2xl font-black">Unable to load trip</h1>
          <p className="mt-2 text-slate-500 dark:text-slate-400">
            {message || 'The requested trip could not be found.'}
          </p>
          <Link
            to="/trips"
            className="mt-6 inline-flex rounded-xl bg-violet-600 px-6 py-3 font-black text-white hover:bg-violet-700"
          >
            Back to My Trips
          </Link>
        </div>
      </div>
    </main>
  );
}

/* -------------------- DATA HELPERS -------------------- */

function normalizeResponse(response) {
  if (!response) return null;
  if (response?.data?.data) return response.data.data;
  if (response?.data?.trip) return response.data.trip;
  if (response?.trip) return response.trip;

  if (
    response?.data &&
    typeof response.data === 'object' &&
    !Array.isArray(response.data)
  ) {
    return response.data;
  }

  if (typeof response === 'object' && !Array.isArray(response)) {
    return response;
  }

  return null;
}

function text(value) {
  if (
    value === null ||
    value === undefined ||
    typeof value === 'object'
  ) {
    return '';
  }

  return String(value).trim();
}

function getDestination(trip) {
  if (typeof trip?.destination === 'string') return trip.destination;
  if (trip?.destination?.name) return text(trip.destination.name);
  if (trip?.destination?.city) return text(trip.destination.city);
  return text(trip?.location) || 'Unknown destination';
}

function getDurationNumber(trip) {
  if (Number(trip?.numberOfDays) > 0) return Number(trip.numberOfDays);
  if (Number(trip?.duration) > 0) return Number(trip.duration);
  if (Array.isArray(trip?.days)) return trip.days.length;
  if (Array.isArray(trip?.itinerary)) return trip.itinerary.length;
  return 0;
}

function getDuration(trip) {
  const number = getDurationNumber(trip);
  if (number) return `${number} ${number === 1 ? 'day' : 'days'}`;
  return text(trip?.numberOfDays) || text(trip?.duration);
}

function getTravelers(trip) {
  if (Number(trip?.travelers) > 0) return Number(trip.travelers);
  if (trip?.travelers?.count) return trip.travelers.count;
  if (trip?.travelers?.number) return trip.travelers.number;
  if (trip?.numberOfTravelers) return trip.numberOfTravelers;
  return '';
}

function getTravelStyle(trip) {
  if (typeof trip?.travelStyle === 'string') return trip.travelStyle;
  if (trip?.travelStyle?.name) return text(trip.travelStyle.name);
  return text(trip?.style);
}

function getBudget(trip) {
  if (typeof trip?.budget === 'number') {
    return {
      total: trip.budget,
      currency: trip.currency || trip.currencyCode || 'INR',
      breakdown: {}
    };
  }

  if (trip?.budget && typeof trip.budget === 'object') {
    return {
      ...trip.budget,
      total:
        trip.budget.total ??
        trip.budget.amount ??
        trip.budget.value ??
        0,
      currency:
        trip.budget.currency ||
        trip.budget.currencyCode ||
        trip.currency ||
        trip.currencyCode ||
        'INR'
    };
  }

  if (trip?.estimatedCost !== undefined) {
    return {
      total: trip.estimatedCost,
      currency: trip.currency || trip.currencyCode || 'INR',
      breakdown: {}
    };
  }

  if (trip?.totalBudget !== undefined) {
    return {
      total: trip.totalBudget,
      currency: trip.currency || trip.currencyCode || 'INR',
      breakdown: {}
    };
  }

  return {
    total: 0,
    currency: trip?.currency || trip?.currencyCode || 'INR',
    breakdown: {}
  };
}

function getBudgetItems(budget) {
  if (!budget?.breakdown || typeof budget.breakdown !== 'object') return [];

  return Object.entries(budget.breakdown)
    .filter(([, value]) => Number.isFinite(Number(value)))
    .map(([label, value]) => ({
      label: formatLabel(label),
      value: Number(value)
    }));
}

function getItinerary(trip) {
  if (Array.isArray(trip?.days)) return trip.days;
  if (Array.isArray(trip?.itinerary)) return trip.itinerary;
  return [];
}

function getTips(trip) {
  if (Array.isArray(trip?.tips)) return trip.tips;
  if (Array.isArray(trip?.travelTips)) return trip.travelTips;
  return [];
}

function getTipText(tip) {
  if (typeof tip === 'string') return tip;
  if (!tip || typeof tip !== 'object') return '';
  return (
    text(tip.text) ||
    text(tip.description) ||
    text(tip.tip) ||
    text(tip.title)
  );
}

function getLocation(activity) {
  if (typeof activity?.location === 'string') return activity.location;
  if (activity?.location?.name) return text(activity.location.name);
  if (activity?.location?.address) return text(activity.location.address);
  return '';
}


function tripIdOrTripKey(trip, tripId = '') {
  return String(
    tripId ||
      trip?._id ||
      trip?.id ||
      trip?.slug ||
      `${getDestination(trip)}-${trip?.startDate || trip?.start_date || ''}`
  );
}

function buildDestinationImageQueries(trip, destination) {
  const destinationObject =
    trip?.destination && typeof trip.destination === 'object'
      ? trip.destination
      : null;

  const city =
    text(destinationObject?.city) ||
    text(destinationObject?.name) ||
    destination;

  const country = text(destinationObject?.country);
  const region =
    text(destinationObject?.state) ||
    text(destinationObject?.region);

  const exact = [city, country, 'landmark', 'travel']
    .filter(Boolean)
    .join(' ');

  const scenic = [city, country, 'scenic', 'travel', 'tourism']
    .filter(Boolean)
    .join(' ');

  const fallback = [city, region, country, 'travel', 'city']
    .filter(Boolean)
    .join(' ');

  return [...new Set([exact, scenic, fallback].filter(Boolean))];
}

function isLandscapePhoto(photo) {
  const width = Number(photo?.width || 0);
  const height = Number(photo?.height || 0);
  return width > 0 && height > 0 && width / height >= 1.25;
}

function isLargeLandscapePhoto(photo) {
  const width = Number(photo?.width || 0);
  const height = Number(photo?.height || 0);

  return (
    width >= 2400 &&
    height >= 1400 &&
    width / height >= 1.25 &&
    width / height <= 2.2
  );
}

function stableImageIndex(key, length) {
  if (!length) return 0;

  let hash = 0;
  const value = String(key);

  for (let i = 0; i < value.length; i += 1) {
    hash = (hash * 31 + value.charCodeAt(i)) >>> 0;
  }

  return hash % length;
}

function getHighQualityUnsplashUrl(photo) {
  const raw = text(photo?.urls?.raw);
  const full = text(photo?.urls?.full);

  if (raw) {
    // 3200 CSS pixels at DPR 1; the browser will display a very sharp 1280px hero.
    // Keep the ixid returned by Unsplash and only add supported transformation params.
    return `${raw}&w=3200&dpr=1&auto=format&fit=crop&q=95`;
  }

  if (full) {
    return `${full}${full.includes('?') ? '&' : '?'}auto=format&fit=max&q=95`;
  }

  return '';
}

function readCachedHeroImage(key) {
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;

    const parsed = JSON.parse(raw);
    return parsed?.url ? parsed : null;
  } catch {
    return null;
  }
}

function writeCachedHeroImage(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // localStorage can be unavailable in restricted browser contexts.
  }
}

function getDestinationImage(trip) {
  const destination = trip?.destination;

  if (typeof destination === 'string') {
    return '';
  }

  return (
    text(destination?.image) ||
    text(destination?.imageUrl) ||
    text(destination?.coverImage) ||
    text(destination?.heroImage) ||
    text(destination?.photo) ||
    ''
  );
}

function getTripImage(trip) {
  return (
    text(trip?.image) ||
    text(trip?.imageUrl) ||
    text(trip?.coverImage) ||
    text(trip?.heroImage) ||
    text(trip?.destinationImage) ||
    text(trip?.destination?.image) ||
    text(trip?.destination?.imageUrl)
  );
}

function getDate(value) {
  if (!value) return '';
  if (typeof value === 'string' || typeof value === 'number') return String(value);
  return '';
}

function formatDateRange(startDate, endDate) {
  if (!startDate && !endDate) return '';

  try {
    const options = {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    };

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);

      if (!Number.isNaN(start.getTime()) && !Number.isNaN(end.getTime())) {
        return `${start.toLocaleDateString('en-IN', options)} – ${end.toLocaleDateString('en-IN', options)}`;
      }
    }

    const value = startDate || endDate;
    const date = new Date(value);

    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleDateString('en-IN', options);
    }
  } catch {
    return '';
  }

  return '';
}

function formatLabel(value) {
  return String(value)
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function currencySymbol(currency) {
  const code = String(currency || 'INR').toUpperCase();

  return {
    INR: '₹',
    USD: '$',
    EUR: '€',
    GBP: '£',
    JPY: '¥',
    CNY: '¥',
    AUD: 'A$',
    CAD: 'C$',
    SGD: 'S$'
  }[code] || code;
}

function formatCurrency(value, currency = 'INR') {
  const number = Number(value);

  if (!Number.isFinite(number)) return '—';

  const code = String(currency || 'INR').toUpperCase();

  let formatted;

  try {
    formatted = new Intl.NumberFormat(
      code === 'INR' ? 'en-IN' : 'en-US',
      { maximumFractionDigits: 0 }
    ).format(number);
  } catch {
    formatted = number.toLocaleString();
  }

  return `${currencySymbol(code)}${formatted}`;
}

function formatBudget(budget) {
  if (!budget) return '—';

  if (typeof budget === 'number') {
    return formatCurrency(budget, 'INR');
  }

  if (typeof budget === 'object') {
    const total =
      budget.total ??
      budget.amount ??
      budget.value;

    if (total === undefined || total === null) return '—';

    return formatCurrency(
      total,
      budget.currency || budget.currencyCode || 'INR'
    );
  }

  return '—';
}
