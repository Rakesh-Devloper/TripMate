import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import aiService from '../../services/aiService.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AIPlannerPage() {
  const nav = useNavigate();
  const { isAuthenticated } = useAuth();

  const [form, setForm] = useState({
    destination: 'Bali',
    startDate: '',
    endDate: '',
    travelers: 2,
    travelStyle: 'Adventure',
    budget: '$1,200',
    interests: ['Culture', 'Nature', 'Food'],
  });

  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();

    setError('');

    /*
     * Validate the form before sending the request.
     */
    if (!form.destination.trim()) {
      setError('Please enter a destination.');
      return;
    }

    if (!form.startDate) {
      setError('Please select a start date.');
      return;
    }

    if (!form.endDate) {
      setError('Please select an end date.');
      return;
    }

    if (new Date(form.endDate) < new Date(form.startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    if (Number(form.travelers) < 1) {
      setError('Travelers must be at least 1.');
      return;
    }

    setLoading(true);

    try {
      /*
       * Send request to the backend through aiService.
       */
      const response = await aiService.generateTrip({
        ...form,
        travelers: Number(form.travelers),
      });

      console.log('========================================');
      console.log('AI TRIP RESPONSE:', response);
      console.log('========================================');

      /*
       * The backend may return different wrappers depending
       * on the endpoint/controller.
       *
       * Normalize all supported response shapes.
       */
      const generatedTrip =
        response?.trip ||
        response?.data?.trip ||
        response?.data ||
        response;

      console.log('NORMALIZED TRIP:', generatedTrip);

      if (!generatedTrip || typeof generatedTrip !== 'object') {
        throw new Error(
          'The AI server returned an invalid trip response.'
        );
      }

      /*
       * IMPORTANT:
       *
       * MongoDB/Mongoose uses `_id`.
       *
       * We prefer `_id` first.
       *
       * `id` is only accepted if it looks like a real MongoDB
       * ObjectId. This prevents fake IDs such as:
       *
       * trip-1789303699503
       */
      const mongoId =
        generatedTrip?._id ||
        response?.data?._id ||
        response?._id;

      /*
       * MongoDB ObjectId is normally a 24-character hexadecimal
       * string.
       */
      const isValidMongoId =
        typeof mongoId === 'string' &&
        /^[a-fA-F0-9]{24}$/.test(mongoId);

      if (!isValidMongoId) {
        console.error(
          'No valid MongoDB trip ID returned by backend.',
          {
            response,
            generatedTrip,
            mongoId,
            generatedId: generatedTrip?.id,
          }
        );

        /*
         * Still show the generated itinerary on the page,
         * but do NOT navigate to a broken Trip Details URL.
         */
        setTrip(generatedTrip);

        throw new Error(
          'Trip was generated, but the server did not return a valid saved trip ID. Please check the backend response.'
        );
      }

      /*
       * Save the normalized trip in state.
       */
      setTrip(generatedTrip);

      console.log(
        'MongoDB Trip ID:',
        mongoId
      );

      /*
       * Navigate using the REAL MongoDB `_id`.
       *
       * Example:
       *
       * /trip/68c123456789abcdef123456
       *
       * NOT:
       *
       * /trip/trip-1789303699503
       */
      nav(`/trip/${mongoId}`);
    } catch (err) {
      console.error(
        'AI Trip Generation Error:',
        err
      );

      /*
       * If we deliberately threw our own validation error,
       * display that message.
       *
       * Otherwise use the backend error if available.
       */
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        err?.message ||
        'AI planner could not generate a trip.';

      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      {/* HEADER */}

      <div className="max-w-2xl">
        <span className="text-violet-600 font-bold">
          AI TRIP PLANNER
        </span>

        <h1 className="text-4xl font-extrabold mt-2 text-slate-900 dark:text-white">
          Build your itinerary in seconds.
        </h1>

        <p className="text-slate-500 dark:text-slate-400 mt-3">
          Tell TripMate where you want to go and what you enjoy.
          The backend securely calls Gemini and saves authenticated
          trips to MongoDB.
        </p>
      </div>

      {/* FORM */}

      <form
        onSubmit={submit}
        className="mt-8 grid md:grid-cols-2 gap-5 p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl"
      >
        {/* DESTINATION */}

        <Field
          label="Destination"
          value={form.destination}
          onChange={(value) =>
            setForm({
              ...form,
              destination: value,
            })
          }
        />

        {/* TRAVELERS */}

        <Field
          label="Travelers"
          type="number"
          min="1"
          max="20"
          value={form.travelers}
          onChange={(value) =>
            setForm({
              ...form,
              travelers: Number(value),
            })
          }
        />

        {/* START DATE */}

        <Field
          label="Start date"
          type="date"
          value={form.startDate}
          onChange={(value) =>
            setForm({
              ...form,
              startDate: value,
            })
          }
        />

        {/* END DATE */}

        <Field
          label="End date"
          type="date"
          value={form.endDate}
          onChange={(value) =>
            setForm({
              ...form,
              endDate: value,
            })
          }
        />

        {/* TRAVEL STYLE */}

        <label>
          <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
            Travel style
          </span>

          <select
            value={form.travelStyle}
            onChange={(e) =>
              setForm({
                ...form,
                travelStyle: e.target.value,
              })
            }
            className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
          >
            <option>Adventure</option>
            <option>Luxury</option>
            <option>Budget</option>
            <option>Romantic</option>
            <option>Family</option>
          </select>
        </label>

        {/* BUDGET */}

        <Field
          label="Budget"
          value={form.budget}
          onChange={(value) =>
            setForm({
              ...form,
              budget: value,
            })
          }
        />

        {/* SUBMIT */}

        <button
          type="submit"
          disabled={loading}
          className="md:col-span-2 py-3.5 rounded-xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {loading
            ? 'Creating your itinerary…'
            : 'Generate AI itinerary'}
        </button>

        {/* ERROR */}

        {error && (
          <div className="md:col-span-2 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900">
            <p className="text-red-600 dark:text-red-400 text-sm">
              {error}
            </p>
          </div>
        )}
      </form>

      {/* PREVIEW */}

      {trip && (
        <div className="mt-8 p-6 rounded-3xl bg-slate-900 text-white">
          <h2 className="text-2xl font-bold">
            {trip.title ||
              `Trip to ${trip.destination}`}
          </h2>

          <p className="text-slate-300 mt-2">
            {trip.numberOfDays
              ? `${trip.numberOfDays} days`
              : 'Personalized itinerary'}
            {' • '}
            {trip.estimatedCost
              ? `$${trip.estimatedCost}`
              : 'Estimated cost available in itinerary'}
          </p>

          <div className="mt-5 space-y-3">
            {(trip.itinerary || []).map(
              (day, index) => (
                <div
                  key={
                    day?._id ||
                    day?.id ||
                    index
                  }
                  className="p-4 rounded-2xl bg-white/10"
                >
                  <b>
                    {day.title ||
                      `Day ${index + 1}`}
                  </b>

                  <p className="text-sm text-slate-300 mt-1">
                    {day.summary ||
                      day.description ||
                      'Explore and enjoy your planned activities.'}
                  </p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* AUTH MESSAGE */}

      {!isAuthenticated && (
        <p className="mt-4 text-sm text-slate-500">
          You can preview an itinerary without logging in.
          Sign in to keep trips in your account.
        </p>
      )}
    </div>
  );
}

/*
|--------------------------------------------------------------------------
| FIELD COMPONENT
|--------------------------------------------------------------------------
*/

function Field({
  label,
  type = 'text',
  value,
  onChange,
  min,
  max,
}) {
  return (
    <label>
      <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
        {label}
      </span>

      <input
        type={type}
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        className="mt-1 w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-violet-500"
      />
    </label>
  );
}